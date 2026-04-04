const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true,
    default: null
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Books', 'Personal', 'Accessories', 'Documents', 'Clothing', 'Other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  foundBy: {
    type: String,
    enum: ['student', 'management'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'claimed', 'returned'],
    default: 'pending'
  },
  claimDeadline: {
    type: Date,
    default: null
  },
  claimedBy: {
    type: String,
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add index for faster queries
foundItemSchema.index({ status: 1, createdAt: -1 });
foundItemSchema.index({ foundBy: 1, status: 1 });

module.exports = mongoose.model('FoundItem', foundItemSchema);