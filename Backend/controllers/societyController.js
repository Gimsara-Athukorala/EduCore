const { Society, SocietyJoiSchema } = require('../Model/Society');
const Admin = require('../Model/Admin');
const asyncHandler = require('../middleware/asyncHandler');
const fs = require('node:fs').promises;
const path = require('node:path');
const joi = require('joi');

const joinRequestCreateSchema = joi.object({
  fullName: joi.string().trim().min(3).max(120).required(),
  email: joi.string().trim().email().max(150).required(),
  studentId: joi.string().trim().min(3).max(30).required(),
  message: joi.string().trim().min(20).max(1000).required(),
});

const joinRequestReviewSchema = joi.object({
  action: joi.string().valid('approve', 'reject').required(),
  note: joi.string().trim().max(500).allow('').optional(),
});

/**
 * @desc Create a new university society
 * @route POST /api/v1/societies
 * @access Private (Admin, Society Leader)
 * @param {Object} req.body - { name, description, category, i sPublic, tags }
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
    leader: req.admin.id,
    members: [{ user: req.admin.id, role: 'moderator' }],
    memberCount: 1,
    createdBy: req.admin.id
  };

  const society = await Society.create(societyData);

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
  const skip = (Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10);
  const societies = await Society.find(query)
    .select('-members -joinRequests') // Exclude private arrays for performance and privacy
    .populate('leader', '_id email')
    .skip(skip)
    .limit(limit)
    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 });

  const total = await Society.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      societies,
      total,
      page: Number.parseInt(page, 10),
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
  const isMember = req.admin ? society.isMember(req.admin.id) : false;
  const isLeader = req.admin ? society.isLeader(req.admin.id) : false;

  // Clone object to modify
  const result = society.toObject({ virtuals: true });

  // If society is not public and user is not a member/leader, omit members array
  if (!society.isPublic && !isMember && !isLeader && req.admin?.role !== 'admin') {
    delete result.members;
  }

  // Join request data is private to admin/leader.
  if (!isLeader && req.admin?.role !== 'admin') {
    delete result.joinRequests;
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

  if (!society?.isActive) {
    res.status(404);
    throw new Error('Society not found');
  }

  // Check if already a member
  if (society.isMember(req.admin.id)) {
    res.status(400);
    throw new Error('You are already a member of this society');
  }

  // Atomic update to add member and increment count
  await Society.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      members: {
        user: req.admin.id,
        role: 'member',
        source: 'account',
        email: req.admin.email,
      },
    },
    $inc: { memberCount: 1 }
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
  if (society.isLeader(req.admin.id)) {
    res.status(400);
    throw new Error('Leader cannot leave. You must transfer leadership first.');
  }

  // Check if member
  if (!society.isMember(req.admin.id)) {
    res.status(400);
    throw new Error('You are not a member of this society');
  }

  // Atomic update to remove member and decrement count
  await Society.findByIdAndUpdate(req.params.id, {
    $pull: { members: { user: req.admin.id } },
    $inc: { memberCount: -1 }
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
  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
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
  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
    res.status(403);
    throw new Error('Not authorized to upload resources to this society');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  let fileType = 'other';
  if (req.file.mimetype.includes('image')) {
    fileType = 'image';
  } else if (req.file.mimetype.includes('video')) {
    fileType = 'video';
  } else if (req.file.mimetype.includes('pdf')) {
    fileType = 'pdf';
  }

  const resource = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    fileType,
    size: req.file.size,
    url: `/uploads/societies/${req.file.filename}`,
    uploadedBy: req.admin.id,
    uploadedAt: Date.now()
  };

  society.resources.push(resource);
  await society.save();

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
  if (req.admin.role !== 'admin' && resource.uploadedBy.toString() !== req.admin.id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  // Delete from storage
  const filePath = path.join(__dirname, '..', 'uploads', 'societies', resource.filename);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`Could not delete file at ${filePath}: ${err.message}`);
  }

  // Remove from array
  society.resources.pull(req.params.resourceId);
  await society.save();

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
  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  // Cannot remove leader
  if (society.isLeader(userId)) {
    res.status(400);
    throw new Error('Leader cannot be removed. You must transfer leadership first.');
  }

  // Remove from array
  society.members = society.members.filter((m) => !m.user || m.user.toString() !== userId);
  society.memberCount = society.members.length;
  await society.save();

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
  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
    res.status(403);
    throw new Error('Not authorized to update member roles');
  }

  // Find member index
  const memberIndex = society.members.findIndex((m) => m.user && m.user.toString() === userId);
  if (memberIndex === -1) {
    res.status(404);
    throw new Error('Member not found in this society');
  }

  // Update role
  society.members[memberIndex].role = role;
  await society.save();

  res.status(200).json({
    success: true,
    message: `Member promoted to ${role}`
  });
});

/**
 * @desc Create society join request
 * @route POST /api/v1/societies/:slug/join-requests
 * @access Public
 */
exports.createJoinRequest = asyncHandler(async (req, res, next) => {
  const { error, value } = joinRequestCreateSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw error;
  }

  const society = await Society.findOne({ slug: req.params.slug, isActive: true });
  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  const normalizedEmail = value.email.toLowerCase().trim();
  const normalizedStudentId = value.studentId.trim();

  const alreadyPending = society.joinRequests.some(
    (r) => r.status === 'pending' && (r.email === normalizedEmail || r.studentId === normalizedStudentId)
  );
  if (alreadyPending) {
    res.status(409);
    throw new Error('A pending request already exists for this email or student ID');
  }

  const alreadyMember = society.members.some(
    (m) => (m.email && m.email === normalizedEmail) || (m.studentId && m.studentId === normalizedStudentId)
  );
  if (alreadyMember) {
    res.status(409);
    throw new Error('This student is already enrolled in this society');
  }

  society.joinRequests.push({
    fullName: value.fullName,
    email: normalizedEmail,
    studentId: normalizedStudentId,
    message: value.message,
    status: 'pending',
    requestedAt: new Date(),
  });

  await society.save();

  res.status(201).json({
    success: true,
    message: 'Join request submitted successfully. Please wait for admin approval.',
  });
});

/**
 * @desc Get join requests for a society
 * @route GET /api/v1/societies/:slug/join-requests
 * @access Private (Admin, Leader)
 */
exports.getJoinRequests = asyncHandler(async (req, res, next) => {
  const society = await Society.findOne({ slug: req.params.slug, isActive: true });
  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
    res.status(403);
    throw new Error('Not authorized to view join requests');
  }

  const requests = [...society.joinRequests].sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
    }
    return new Date(b.requestedAt) - new Date(a.requestedAt);
  });

  res.status(200).json({
    success: true,
    data: requests,
  });
});

/**
 * @desc Approve or reject join request
 * @route PATCH /api/v1/societies/:slug/join-requests/:requestId
 * @access Private (Admin, Leader)
 */
exports.reviewJoinRequest = asyncHandler(async (req, res, next) => {
  const { error, value } = joinRequestReviewSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw error;
  }

  const society = await Society.findOne({ slug: req.params.slug, isActive: true });
  if (!society) {
    res.status(404);
    throw new Error('Society not found');
  }

  if (req.admin.role !== 'admin' && !society.isLeader(req.admin.id)) {
    res.status(403);
    throw new Error('Not authorized to review join requests');
  }

  const request = society.joinRequests.id(req.params.requestId);
  if (!request) {
    res.status(404);
    throw new Error('Join request not found');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('This request has already been reviewed');
  }

  if (value.action === 'approve') {
    const duplicateMember = society.members.some(
      (m) => (m.email && m.email === request.email) || (m.studentId && m.studentId === request.studentId)
    );
    if (duplicateMember) {
      res.status(409);
      throw new Error('This requester is already enrolled');
    }

    society.members.push({
      role: 'member',
      source: 'join_request',
      displayName: request.fullName,
      email: request.email,
      studentId: request.studentId,
      joinedAt: new Date(),
    });
    society.memberCount = society.members.length;
    request.status = 'approved';
  } else {
    request.status = 'rejected';
  }

  request.reviewedAt = new Date();
  request.reviewedBy = req.admin.id;

  await society.save();

  res.status(200).json({
    success: true,
    message: value.action === 'approve' ? 'Join request approved and member enrolled' : 'Join request rejected',
  });
});
