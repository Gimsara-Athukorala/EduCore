const express = require('express');
const router = express.Router();
const {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
  getClaimStats
} = require('../controllers/claimController');

// Public routes (with validation)
router.post('/', createClaim);
router.get('/my-claims', getMyClaims);
router.get('/:id', getClaimById);

// Admin routes (with password protection in controller)
router.get('/', getAllClaims);
router.put('/:id/status', updateClaimStatus);
router.delete('/:id', deleteClaim);
router.get('/admin/stats', getClaimStats);

module.exports = router;