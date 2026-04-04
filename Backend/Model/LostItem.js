const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
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
    trim: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Books', 'Personal Belongings', 'Accessories', 'Documents', 'Clothing', 'Other']
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'resolved'],
    default: 'pending'
  },
  reward: {
    type: String,
    default: 'No reward specified'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LostItem', lostItemSchema);