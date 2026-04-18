const Material = require('../models/Material');
const fs = require('fs');
const path = require('path');

exports.uploadMaterial = async (req, res) => {
    try {
        const { module, title, materialType, uploadMethod, description, url } = req.body;
        let fileUrl = uploadMethod === 'file' ? `/uploads/${req.file.filename}` : url;

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
        if (material && material.uploadMethod === 'file') {
            const filePath = path.join(__dirname, '..', material.fileUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};