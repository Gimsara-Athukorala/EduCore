const {
  createSociety,
  getAllSocieties,
  getSocietyBySlug,
  joinSociety,
  leaveSociety,
  updateSociety,
  deleteSociety,
  uploadResource,
  deleteResource,
  removeMember,
  updateMemberRole
} = require('../controllers/societyController');
const { SocietyJoiSchema } = require('../Model/Society');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

/**
 * Rate limit for write operations (30 requests per 15 minutes)
 */
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many requests. Please try again after 15 minutes'
});

/**
 * Rate limit for read operations (100 requests per 15 minutes)
 */
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again after 15 minutes'
});

// GET /api/v1/societies
// Description: Get all societies
// Auth required: No
// Roles allowed: All
router.get('/', readLimiter, getAllSocieties);

// GET /api/v1/societies/:slug
// Description: Get single society by slug
// Auth required: No (Conditional visibility logic in controller)
// Roles allowed: All
router.get('/:slug', readLimiter, getSocietyBySlug);

// POST /api/v1/societies
// Description: Create a new society
// Auth required: Yes
// Roles allowed: admin, society_leader
router.post('/', requireAdminAuth, writeLimiter, validate(SocietyJoiSchema), createSociety);

// PUT /api/v1/societies/:id
// Description: Update society details
// Auth required: Yes
// Roles allowed: admin, owner (leader)
router.put('/:id', requireAdminAuth, writeLimiter, updateSociety);

// DELETE /api/v1/societies/:id
// Description: Soft delete society
// Auth required: Yes
// Roles allowed: admin
router.delete('/:id', requireAdminAuth, writeLimiter, deleteSociety);

// POST /api/v1/societies/:id/join
// Description: Join a society
// Auth required: Yes
// Roles allowed: student, society_leader
router.post('/:id/join', requireAdminAuth, writeLimiter, joinSociety);

// POST /api/v1/societies/:id/leave
// Description: Leave a society
// Auth required: Yes
// Roles allowed: student, society_leader
router.post('/:id/leave', requireAdminAuth, writeLimiter, leaveSociety);

// POST /api/v1/societies/:id/resources
// Description: Upload resource to society
// Auth required: Yes
// Roles allowed: admin, owner (leader)
router.post(
  '/:id/resources',
  requireAdminAuth,
  writeLimiter,
  upload.single('file', 'societies'), // Multer middleware
  uploadResource
);

// DELETE /api/v1/societies/:id/resources/:resourceId
// Description: Delete resource from society
// Auth required: Yes
// Roles allowed: admin, uploader
router.delete('/:id/resources/:resourceId', requireAdminAuth, writeLimiter, deleteResource);

// DELETE /api/v1/societies/:slug/members/:userId
// Description: Remove member from society
// Auth required: Yes
// Roles allowed: admin, society_leader
router.delete('/:slug/members/:userId', requireAdminAuth, writeLimiter, removeMember);

// PATCH /api/v1/societies/:slug/members/:userId/role
// Description: Update member role
// Auth required: Yes
// Roles allowed: admin, society_leader
router.patch('/:slug/members/:userId/role', requireAdminAuth, writeLimiter, updateMemberRole);

module.exports = router;
