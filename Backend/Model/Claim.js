const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  // Item being claimed
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoundItem',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemCategory: {
    type: String,
    required: true
  },
  itemImageUrl: {
    type: String,
    default: null
  },
  itemLocation: {
    type: String,
    required: true
  },
  itemDate: {
    type: Date,
    required: true
  },
  
  // Claimant information
  claimantFullName: {
    type: String,
    required: true,
    trim: true
  },
  claimantStudentId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  claimantEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  claimantContactNumber: {
    type: String,
    trim: true,
    default: null
  },
  
  // ID Proof
  idProofType: {
    type: String,
    enum: ['Student ID Card', 'National ID Card', "Driver's License", 'Passport', 'Other'],
    required: true
  },
  idProofNumber: {
    type: String,
    required: true,
    trim: true
  },
  
  // Claim details
  claimDate: {
    type: Date,
    default: Date.now
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Claim status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Verification details
  verifiedBy: {
    type: String,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  
  // Collection details
  collectedAt: {
    type: Date,
    default: null
  },
  collectedBy: {
    type: String,
    default: null
  },
  
  // Pickup email metadata
  pickupCode: {
    type: String,
    default: null
  },
  pickupEmailSentAt: {
    type: Date,
    default: null
  },
  pickupEmailSentStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  pickupEmailError: {
    type: String,
    default: null
  },
  
  // Admin notes
  adminNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
claimSchema.index({ claimantStudentId: 1 });
claimSchema.index({ itemId: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ createdAt: -1 });

// Prevent duplicate claims for the same item by the same student (only for pending/approved)
claimSchema.index({ itemId: 1, claimantStudentId: 1 }, { 
  unique: true,
  partialFilterExpression: { status: { $in: ['pending', 'approved'] } }
});

module.exports = mongoose.model('Claim', claimSchema);