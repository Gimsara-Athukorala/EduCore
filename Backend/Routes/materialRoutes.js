const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'materials');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `material-${uniqueSuffix}${ext}`);
    }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), materialController.uploadMaterial);
router.get('/', materialController.getAllMaterials);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;