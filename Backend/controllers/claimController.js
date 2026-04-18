const Claim = require('../Model/Claim');
const FoundItem = require('../Model/FoundItem');
const { sendClaimApprovedEmail } = require('../utils/emailService');

const generatePickupCode = (claimId) => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PICKUP-${claimId.toString().slice(-6).toUpperCase()}-${randomPart}`;
};

// @desc    Create a new claim
// @route   POST /api/claims
const createClaim = async (req, res) => {
  try {
    const {
      itemId,
      claimantFullName,
      claimantStudentId,
      claimantEmail,
      claimantContactNumber,
      idProofType,
      idProofNumber,
      additionalNotes
    } = req.body;

    const normalizedStudentId = String(claimantStudentId || '').trim().toUpperCase();
    const normalizedProofType = String(idProofType || '').trim();
    const normalizedProofNumber = String(idProofNumber || '').trim().toUpperCase();
    const canonicalProofTypeMap = {
      'Student ID': 'Student ID Card',
      'NIC': 'National ID Card',
      'Student ID Card': 'Student ID Card',
      'National ID Card': 'National ID Card'
    };
    const canonicalProofType = canonicalProofTypeMap[normalizedProofType] || normalizedProofType;

    // Validate required fields
    if (!itemId || !claimantFullName || !claimantStudentId || !claimantEmail || !idProofType || !idProofNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const allowedProofTypes = ['Student ID', 'NIC', 'Student ID Card', 'National ID Card'];
    if (!allowedProofTypes.includes(normalizedProofType)) {
      return res.status(400).json({
        success: false,
        message: 'ID proof type must be Student ID or NIC'
      });
    }

    // Check if item exists and is available
    const foundItem = await FoundItem.findById(itemId);
    
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (foundItem.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `This item is not available for claim. Current status: ${foundItem.status}`
      });
    }

    // Check if claim deadline has passed (for management items)
    if (foundItem.foundBy === 'management' && foundItem.claimDeadline) {
      const now = new Date();
      if (now > foundItem.claimDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Claim deadline for this item has passed'
        });
      }
    }

    // Check if user has already claimed this item
    const existingClaim = await Claim.findOne({
      itemId: itemId,
      claimantStudentId: normalizedStudentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted a claim for this item. Status: ${existingClaim.status}`
      });
    }

    // Validate student ID format
    const studentIdPattern = /^STU\d{10}$/i;
    if (!studentIdPattern.test(normalizedStudentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student ID must begin with STU followed by exactly 10 digits (e.g., STU2024123456)'
      });
    }

    if (canonicalProofType === 'Student ID Card' && normalizedProofNumber !== normalizedStudentId) {
      return res.status(400).json({
        success: false,
        message: 'ID proof number must match the Student ID when Student ID is selected as proof type'
      });
    }

    if (canonicalProofType === 'National ID Card') {
      const nicPattern = /^(?:\d{9}[VvXx]|\d{12})$/;
      if (!nicPattern.test(String(idProofNumber).trim())) {
        return res.status(400).json({
          success: false,
          message: 'NIC must be 12 digits or 9 digits followed by V/X'
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(claimantEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate name format
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(claimantFullName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Full name can only contain letters and spaces'
      });
    }

    // Create claim with item details
    const claim = await Claim.create({
      itemId,
      itemName: foundItem.itemName,
      itemCategory: foundItem.category,
      itemImageUrl: foundItem.imageUrl,
      itemLocation: foundItem.location,
      itemDate: foundItem.date,
      claimantFullName: claimantFullName.trim(),
      claimantStudentId: normalizedStudentId,
      claimantEmail: claimantEmail.toLowerCase().trim(),
      claimantContactNumber: claimantContactNumber || null,
      idProofType: canonicalProofType,
      idProofNumber: normalizedProofNumber,
      additionalNotes: additionalNotes || '',
      status: 'pending'
    });

    // Update found item status to claimed
    foundItem.status = 'claimed';
    foundItem.claimedBy = normalizedStudentId;
    foundItem.claimedAt = new Date();
    await foundItem.save();

    res.status(201).json({
      success: true,
      data: claim,
      message: 'Claim submitted successfully! Please wait for admin approval.'
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a claim for this item'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating claim',
      error: error.message
    });
  }
};

// @desc    Get all claims (Admin only)
// @route   GET /api/claims
const getAllClaims = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { claimantFullName: { $regex: search, $options: 'i' } },
        { claimantStudentId: { $regex: search, $options: 'i' } },
        { itemName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Claim.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching claims',
      error: error.message
    });
  }
};

// @desc    Get claims by student ID
// @route   GET /api/claims/my-claims
const getMyClaims = async (req, res) => {
  try {
    const { studentId } = req.query;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    
    const claims = await Claim.find({ claimantStudentId: studentId.toUpperCase() })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: claims
    });
  } catch (error) {
    console.error('Error fetching user claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your claims',
      error: error.message
    });
  }
};

// @desc    Get single claim by ID
// @route   GET /api/claims/:id
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching claim',
      error: error.message
    });
  }
};

// @desc    Update claim status (Admin only)
// @route   PUT /api/claims/:id/status
const updateClaimStatus = async (req, res) => {
  try {
    const { status, rejectionReason, adminNotes, adminPassword } = req.body;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }
    
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }
    
    // Get the found item
    const foundItem = await FoundItem.findById(claim.itemId);
    const oldStatus = claim.status;
    
    // Update claim status
    claim.status = status;
    claim.adminNotes = adminNotes || claim.adminNotes;
    
    if (status === 'approved') {
      claim.verifiedBy = 'admin';
      claim.verifiedAt = new Date();
      claim.pickupCode = claim.pickupCode || generatePickupCode(claim._id);
      
      // Update found item status to claimed (already claimed when claim was created)
      if (foundItem) {
        foundItem.status = 'claimed';
        foundItem.claimedBy = claim.claimantStudentId;
        foundItem.claimedAt = new Date();
        await foundItem.save();
      }

      claim.pickupCode = claim.pickupCode || generatePickupCode(claim._id);
    } else if (status === 'rejected') {
      claim.rejectionReason = rejectionReason || 'No reason provided';
      
      // IMPORTANT: Revert the found item status back to approved
      if (foundItem) {
        foundItem.status = 'approved';
        foundItem.claimedBy = null;
        foundItem.claimedAt = null;
        await foundItem.save();
      }
    } else if (status === 'completed') {
      claim.collectedAt = new Date();
      claim.collectedBy = 'admin';
      
      // Update found item status to returned
      if (foundItem) {
        foundItem.status = 'returned';
        await foundItem.save();
      }
    }
    
    await claim.save();

    let emailNotification = {
      attempted: false,
      sent: false,
      skipped: false,
      reason: null,
      recipient: claim.claimantEmail || null,
    };

    if (status === 'approved' && oldStatus !== 'approved') {
      emailNotification.attempted = true;
      try {
        const emailResult = await sendClaimApprovedEmail({
          to: claim.claimantEmail,
          claimantName: claim.claimantFullName,
          itemName: claim.itemName,
          pickupCode: claim.pickupCode,
        });

        if (emailResult?.skipped) {
          emailNotification.skipped = true;
          emailNotification.reason = emailResult.reason || 'Email send skipped';
        } else {
          emailNotification.sent = true;
        }
      } catch (emailError) {
        emailNotification.reason = emailError.message;
        console.error('Error sending approval email:', emailError);
      }
    } else if (status === 'approved' && oldStatus === 'approved') {
      emailNotification.reason = 'Claim was already approved previously';
    }
    
    res.status(200).json({
      success: true,
      data: claim,
      message: `Claim ${status} successfully`,
      emailNotification,
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating claim status',
      error: error.message
    });
  }
};

// @desc    Delete claim (Admin only)
// @route   DELETE /api/claims/:id
const deleteClaim = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }
    
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }
    
    // If claim was pending or rejected, revert the found item status back to approved
    if (claim.status !== 'approved' && claim.status !== 'completed') {
      const foundItem = await FoundItem.findById(claim.itemId);
      if (foundItem && foundItem.status === 'claimed') {
        foundItem.status = 'approved';
        foundItem.claimedBy = null;
        foundItem.claimedAt = null;
        await foundItem.save();
      }
    }
    
    await claim.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting claim',
      error: error.message
    });
  }
};

// @desc    Get claim statistics (Admin only)
// @route   GET /api/claims/stats
const getClaimStats = async (req, res) => {
  try {
    const { adminPassword } = req.query;
    
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }
    
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const approvedClaims = await Claim.countDocuments({ status: 'approved' });
    const rejectedClaims = await Claim.countDocuments({ status: 'rejected' });
    const completedClaims = await Claim.countDocuments({ status: 'completed' });
    
    const dailyClaims = await Claim.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: 7 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalClaims,
        pending: pendingClaims,
        approved: approvedClaims,
        rejected: rejectedClaims,
        completed: completedClaims,
        daily: dailyClaims
      }
    });
  } catch (error) {
    console.error('Error fetching claim stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
  getClaimStats
};