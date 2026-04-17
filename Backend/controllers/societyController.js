const { Society, SocietyJoiSchema } = require('../models/Society');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('../middleware/asyncHandler');
const storageService = require('../services/storageService');
const joi = require('joi');

/**
 * @desc Create a new university society
 * @route POST /api/v1/societies
 * @access Private (Admin, Society Leader)
 * @param {Object} req.body - { name, description, category, isPublic, tags }
 * @returns {Object} { success, data: Society }
 */
exports.createSociety = asyncHandler(async (req, res, next) => {
  const value = req.body;

  // Check if society name already exists
  const exists = await Society.findOne({ name: value.name });
  if (exists) {
    res.status(400);
    throw new Error('Society with this name already exists');
  }

  // Auto-assign leader and add as first member
  const societyData = {
    ...value,
    leader: req.user._id,
    members: [{ user: req.user._id, role: 'moderator' }],
    memberCount: 1,
    createdBy: req.user._id
  };

  const society = await Society.create(societyData);

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'created_society',
    description: `Created a new society: <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  // Return populated leader
  const populatedSociety = await Society.findById(society._id).populate('leader', 'name email');

  res.status(201).json({
    success: true,
    data: populatedSociety
  });
});

/**
 * @desc Get all societies with pagination and filters
 * @route GET /api/v1/societies
 * @access Public
 * @query {string} category, search, isPublic, page, limit
 * @returns {Object} { success, data: { societies, total, page, totalPages } }
 */
exports.getAllSocieties = asyncHandler(async (req, res, next) => {
  const { category, search, isPublic, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  // Apply filters
  if (category) query.category = category;
  if (isPublic) query.isPublic = isPublic === 'true';
  if (search) {
    query.$text = { $search: search };
  }

  // Execute query with pagination (never return members array)
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const societies = await Society.find(query)
    .select('-members') // Exclude members for performance
    .skip(skip)
    .limit(limit)
    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 });

  const total = await Society.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      societies,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc Get single society by slug
 * @route GET /api/v1/societies/:slug
 * @access Public
 * @returns {Object} { success, data: Society }
 */
exports.getSocietyBySlug = asyncHandler(async (req, res, next) => {
  const society = await Society.findOne({ slug: req.params.slug, isActive: true })
    .populate('leader', 'name email profilePicture');

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Conditional privacy logic
  const isMember = req.user ? society.isMember(req.user._id) : false;
  const isLeader = req.user ? society.isLeader(req.user._id) : false;

  // Clone object to modify
  const result = society.toObject({ virtuals: true });

  // If society is not public and user is not a member/leader, omit members array
  if (!society.isPublic && !isMember && !isLeader && req.user?.role !== 'admin') {
    delete result.members;
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc Join a society
 * @route POST /api/v1/societies/:id/join
 * @access Private (Student, Society Leader)
 * @returns {Object} { success, message }
 */
exports.joinSociety = asyncHandler(async (req, res, next) => {
  const society = await Society.findById(req.params.id);

  if (!society || !society.isActive) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Check if already a member
  if (society.isMember(req.user._id)) {
    res.status(400);
    throw new Error('You are already a member of this society');
  }

  // Atomic update to add member and increment count
  await Society.findByIdAndUpdate(req.params.id, {
    $addToSet: { members: { user: req.user._id, role: 'member' } },
    $inc: { memberCount: 1 }
  });

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'joined_society',
    description: `Joined the society <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    message: 'Joined society successfully'
  });
});

/**
 * @desc Leave a society
 * @route POST /api/v1/societies/:id/leave
 * @access Private (Student, Society Leader)
 * @returns {Object} { success, message }
 */
exports.leaveSociety = asyncHandler(async (req, res, next) => {
  const society = await Society.findById(req.params.id);

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Leader cannot leave
  if (society.isLeader(req.user._id)) {
    res.status(400);
    throw new Error('Leader cannot leave. You must transfer leadership first.');
  }

  // Check if member
  if (!society.isMember(req.user._id)) {
    res.status(400);
    throw new Error('You are not a member of this society');
  }

  // Atomic update to remove member and decrement count
  await Society.findByIdAndUpdate(req.params.id, {
    $pull: { members: { user: req.user._id } },
    $inc: { memberCount: -1 }
  });

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'left_society',
    description: `Left the society <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    message: 'Left society successfully'
  });
});

/**
 * @desc Update society details
 * @route PUT /api/v1/societies/:id
 * @access Private (Admin, Owner)
 */
exports.updateSociety = asyncHandler(async (req, res, next) => {
  let society = await Society.findById(req.params.id);

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Authorization check: Admin or Leader
  if (req.user.role !== 'admin' && !society.isLeader(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this society');
  }

  // Validate updatable fields
  const updateSchema = joi.object({
    name: joi.string().min(3).max(100),
    description: joi.string().min(20).max(1000),
    category: joi.string().valid(
      'Engineering', 'Finance & Technology', 'Arts & Culture',
      'Social Impact', 'Sports', 'Science', 'Health & Wellness', 'Other'
    ),
    isPublic: joi.boolean(),
    tags: joi.array().items(joi.string().max(20)).max(5)
  });

  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw error;
  }

  // Update
  society = await Society.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true
  });

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'updated_society',
    description: `Updated details for <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    data: society
  });
});

/**
 * @desc Soft delete society
 * @route DELETE /api/v1/societies/:id
 * @access Private (Admin only)
 */
exports.deleteSociety = asyncHandler(async (req, res, next) => {
  const society = await Society.findById(req.params.id);

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Soft delete
  society.isActive = false;
  await society.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'deleted_society',
    description: `Deactivated the society <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    message: 'Society deactivated successfully'
  });
});

/**
 * @desc Upload resource to society
 * @route POST /api/v1/societies/:id/resources
 * @access Private (Admin, Owner)
 */
exports.uploadResource = asyncHandler(async (req, res, next) => {
  const society = await Society.findById(req.params.id);

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Authorization: Admin or Leader
  if (req.user.role !== 'admin' && !society.isLeader(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to upload resources to this society');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const filename = await storageService.saveFile(req.file);

  const resource = {
    filename,
    originalName: req.file.originalname,
    fileType: req.file.mimetype.includes('image') ? 'image' : 
              req.file.mimetype.includes('video') ? 'video' : 
              req.file.mimetype.includes('pdf') ? 'pdf' : 'other',
    size: req.file.size,
    url: storageService.getFileUrl(filename),
    uploadedBy: req.user._id,
    uploadedAt: Date.now()
  };

  society.resources.push(resource);
  await society.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'uploaded_resource',
    description: `Uploaded a resource: <b>${resource.originalName}</b> to <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    data: resource
  });
});

/**
 * @desc Delete resource from society
 * @route DELETE /api/v1/societies/:id/resources/:resourceId
 * @access Private (Admin, Uploader)
 */
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const society = await Society.findById(req.params.id);

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  const resource = society.resources.id(req.params.resourceId);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Authorization: Admin or Uploader
  if (req.user.role !== 'admin' && resource.uploadedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  // Delete from storage
  await storageService.deleteFile(resource.filename);

  // Remove using Mongoose's Document.remove() or filter
  society.resources.pull(req.params.resourceId);
  await society.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'deleted_resource',
    description: `Deleted a resource from <b>${society.name}</b>`,
    metadata: { societyId: society._id, societyName: society.name }
  });

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully'
  });
});

/**
 * @desc Remove member from society
 * @route DELETE /api/v1/societies/:slug/members/:userId
 * @access Private (Admin, Owner/Moderator)
 */
exports.removeMember = asyncHandler(async (req, res, next) => {
  const { slug, userId } = req.params;
  const society = await Society.findOne({ slug });

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Authorization: Admin or Leader
  if (req.user.role !== 'admin' && !society.isLeader(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  // Cannot remove leader
  if (society.isLeader(userId)) {
    res.status(400);
    throw new Error('Leader cannot be removed. You must transfer leadership first.');
  }

  // Remove from array
  society.members = society.members.filter(m => m.user.toString() !== userId);
  society.memberCount = society.members.length;
  await society.save();

  // Log activity (using system_alert or new action)
  await ActivityLog.create({
    user: req.user._id,
    action: 'system_alert',
    description: `Removed a member from <b>${society.name}</b>`,
    metadata: { societyId: society._id, targetUserId: userId }
  });

  res.status(200).json({
    success: true,
    message: 'Member removed successfully'
  });
});

/**
 * @desc Update member role
 * @route PATCH /api/v1/societies/:slug/members/:userId/role
 * @access Private (Admin, Owner)
 */
exports.updateMemberRole = asyncHandler(async (req, res, next) => {
  const { slug, userId } = req.params;
  const { role } = req.body;

  if (!['member', 'moderator'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const society = await Society.findOne({ slug });

  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Authorization: Admin or Leader
  if (req.user.role !== 'admin' && !society.isLeader(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update member roles');
  }

  // Find member index
  const memberIndex = society.members.findIndex(m => m.user.toString() === userId);
  if (memberIndex === -1) {
    res.status(404);
    throw new Error('Member not found in this society');
  }

  // Update role
  society.members[memberIndex].role = role;
  await society.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'role_updated',
    description: `Updated member role to <b>${role}</b> in <b>${society.name}</b>`,
    metadata: { societyId: society._id, targetUserId: userId, newRole: role }
  });

  res.status(200).json({
    success: true,
    message: `Member promoted to ${role}`
  });
});
