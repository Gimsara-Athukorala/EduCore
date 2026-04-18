const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Generic Multer Upload Middleware
 * Supports different directories based on the 'type' parameter
 */
const upload = {
  single: (fieldName, subDir = 'general') => {
    const uploadDir = `uploads/${subDir}`;
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${fieldName}-${uniqueSuffix}${ext}`);
      }
    });

    const fileFilter = (req, file, cb) => {
      // Basic image and document filter
      const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|mp4/;
      const isExtAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const isMimeAllowed = allowedTypes.test(file.mimetype);

      if (isExtAllowed && isMimeAllowed) {
        cb(null, true);
      } else {
        cb(new Error('File type not supported'));
      }
    };

    return multer({
      storage: storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
      fileFilter: fileFilter
    }).single(fieldName);
  }
};

module.exports = upload;
