const Material = require('../Model/Material');
const fs = require('node:fs');
const path = require('node:path');

exports.uploadMaterial = async (req, res) => {
    try {
        const { module, title, materialType, uploadMethod, description, url } = req.body;

        if (!module || !title || !materialType || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (uploadMethod === 'file' && !req.file) {
            return res.status(400).json({ message: 'File is required for file upload method' });
        }

        if (uploadMethod === 'url' && !url) {
            return res.status(400).json({ message: 'URL is required for url upload method' });
        }

        const fileUrl = uploadMethod === 'file'
            ? `/uploads/materials/${req.file.filename}`
            : url;

        const newMaterial = new Material({ module, title, materialType, uploadMethod, fileUrl, description });
        await newMaterial.save();
        res.status(201).json({ message: 'Success', material: newMaterial });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
};

exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find().sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        if (material.uploadMethod === 'file' && material.fileUrl) {
            const relativeFilePath = material.fileUrl.replace(/^\//, '');
            const filePath = path.join(__dirname, '..', relativeFilePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};