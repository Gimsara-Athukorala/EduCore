const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItemStatus,
  claimFoundItem,
  markAsReturned,
  deleteFoundItem,
  getPendingItems,
  getStats
} = require('../controllers/foundItemController');

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
    cb(null, 'found-' + uniqueSuffix + ext);
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

// Public routes
router.get('/', getFoundItems);
router.get('/:id', getFoundItemById);

// Routes with image upload
router.post('/', upload.single('image'), createFoundItem);

// Claim routes
router.post('/:id/claim', claimFoundItem);

// Admin routes (with password protection)
router.put('/:id/status', updateFoundItemStatus);
router.put('/:id/return', markAsReturned);
router.delete('/:id', deleteFoundItem);
router.get('/admin/pending', getPendingItems);
router.get('/admin/stats', getStats);

module.exports = router;