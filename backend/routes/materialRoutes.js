const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('file'), materialController.uploadMaterial);
router.get('/', materialController.getAllMaterials);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;