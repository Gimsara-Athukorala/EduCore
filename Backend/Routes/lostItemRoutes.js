const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItemStatus,
  deleteLostItem,
  getPendingItems,
  getStats
} = require('../controllers/lostItemController');

// Configure multer directly in routes file
const uploadDir = 'uploads/lost-items';
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
    cb(null, 'lost-' + uniqueSuffix + ext);
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
router.get('/', getLostItems);
router.get('/:id', getLostItemById);

// Routes with image upload
router.post('/', upload.single('image'), createLostItem);

// Admin routes
router.put('/:id/status', updateLostItemStatus);
router.delete('/:id', deleteLostItem);
router.get('/admin/pending', getPendingItems);
router.get('/admin/stats', getStats);

module.exports = router;