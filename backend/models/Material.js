const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    module: { type: String, required: true },
    title: { type: String, required: true },
    materialType: { type: String, required: true },
    uploadMethod: { type: String, enum: ['file', 'url'], required: true },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);