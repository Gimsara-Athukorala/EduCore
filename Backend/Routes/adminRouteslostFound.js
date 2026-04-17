const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getPendingItems,
  getAcceptedItems,
  getPendingClaimsWithImages,
  updateLostItemStatus,
  updateFoundItemStatus,
  updateClaimStatus,
  deleteLostItem,
  deleteFoundItem,
  deleteClaim,
  addManualFoundItem,
  getAllClaims,
  getClaimStats,
  getClaimById,
  bulkUpdateClaims,
  exportData
} = require('../controllers/adminControllerlostitems');

// Configure multer for file upload
const uploadDir = 'uploads/found-items';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'admin-found-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.use(requireAdminAuth);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Pending and accepted items
router.get('/pending', getPendingItems);
router.get('/accepted', getAcceptedItems);
router.get('/pending-claims', getPendingClaimsWithImages);

// Claim management
router.get('/claims', getAllClaims);
router.get('/claim/:id', getClaimById);
router.get('/claim-stats', getClaimStats);
router.put('/claim/:id', updateClaimStatus);
router.delete('/claim/:id', deleteClaim);
router.put('/claims/bulk', bulkUpdateClaims);

// Lost item management
router.put('/lost/:id', updateLostItemStatus);
router.delete('/lost/:id', deleteLostItem);

// Found item management
router.put('/found/:id', updateFoundItemStatus);
router.delete('/found/:id', deleteFoundItem);
router.post('/found/manual', upload.single('image'), addManualFoundItem);

// Export data
router.get('/export/:type', exportData);

module.exports = router;