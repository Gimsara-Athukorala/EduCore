const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    materialType: {
      type: String,
      required: true,
      enum: ['past_paper', 'short_note', 'kuppi_video', 'pdf', 'video', 'audio', 'document'],
    },
    uploadMethod: {
      type: String,
      enum: ['file', 'url'],
      default: 'file',
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);