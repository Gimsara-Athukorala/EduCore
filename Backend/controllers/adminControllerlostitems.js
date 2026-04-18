const LostItem = require('../Model/LostItem');
const FoundItem = require('../Model/FoundItem');
const Claim = require('../Model/Claim');
const fs = require('fs').promises;
const path = require('path');
const { sendClaimApprovedEmail } = require('../utils/emailService');

const generatePickupCode = (claimId) => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PICKUP-${claimId.toString().slice(-6).toUpperCase()}-${randomPart}`;
};

// Helper function to delete image file
const deleteImageFile = async (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '..', imagePath);
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      console.log('Image deleted:', fullPath);
    } catch (error) {
      console.log('Image file not found:', error.message);
    }
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const pendingLost = await LostItem.countDocuments({ status: 'pending' });
    const pendingFound = await FoundItem.countDocuments({ status: 'pending' });
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    
    const approvedLost = await LostItem.countDocuments({ status: 'approved' });
    const approvedFound = await FoundItem.countDocuments({ status: 'approved' });
    const approvedClaims = await Claim.countDocuments({ status: 'approved' });
    
    const returnedItems = await FoundItem.countDocuments({ status: 'returned' });
    const totalItems = await FoundItem.countDocuments();
    
    const acceptanceRate = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        pending: {
          lost: pendingLost,
          found: pendingFound,
          claims: pendingClaims
        },
        approved: {
          lost: approvedLost,
          found: approvedFound,
          claims: approvedClaims
        },
        returned: returnedItems,
        total: totalItems,
        acceptanceRate
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Get all pending items (lost, found, claims)
// @route   GET /api/admin/pending
const getPendingItems = async (req, res) => {
  try {
    const pendingLost = await LostItem.find({ status: 'pending' }).sort({ createdAt: -1 });
    const pendingFound = await FoundItem.find({ status: 'pending' }).sort({ createdAt: -1 });
    const pendingClaims = await Claim.find({ status: 'pending' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        lost: pendingLost,
        found: pendingFound,
        claims: pendingClaims
      }
    });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending items',
      error: error.message
    });
  }
};

// @desc    Get all accepted items (approved)
// @route   GET /api/admin/accepted
const getAcceptedItems = async (req, res) => {
  try {
    const acceptedLost = await LostItem.find({ status: 'approved' }).sort({ createdAt: -1 });
    const acceptedFound = await FoundItem.find({ status: 'approved' }).sort({ createdAt: -1 });
    const acceptedClaims = await Claim.find({ status: 'approved' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        lost: acceptedLost,
        found: acceptedFound,
        claims: acceptedClaims
      }
    });
  } catch (error) {
    console.error('Error fetching accepted items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accepted items',
      error: error.message
    });
  }
};

// @desc    Get pending claims with full details
// @route   GET /api/admin/pending-claims
const getPendingClaimsWithImages = async (req, res) => {
  try {
    const pendingClaims = await Claim.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingClaims
    });
  } catch (error) {
    console.error('Error fetching pending claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending claims',
      error: error.message
    });
  }
};

// @desc    Update lost item status
// @route   PUT /api/admin/lost/:id
const updateLostItemStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    lostItem.status = status;
    if (adminNotes) {
      lostItem.adminNotes = adminNotes;
    }
    
    await lostItem.save();

    res.status(200).json({
      success: true,
      data: lostItem,
      message: `Lost item ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating lost item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lost item',
      error: error.message
    });
  }
};

// @desc    Update found item status
// @route   PUT /api/admin/found/:id
const updateFoundItemStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const foundItem = await FoundItem.findById(req.params.id);
    
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    const oldStatus = foundItem.status;
    foundItem.status = status;
    if (adminNotes) {
      foundItem.adminNotes = adminNotes;
    }
    
    // If marking as returned, clear claim info
    if (status === 'returned') {
      foundItem.claimedBy = null;
      foundItem.claimedAt = null;
    }
    
    await foundItem.save();

    // If status changed from claimed back to approved (rejection scenario)
    if (oldStatus === 'claimed' && status === 'approved') {
      // Find any pending claims for this item and update them
      await Claim.updateMany(
        { itemId: foundItem._id, status: 'pending' },
        { status: 'rejected', rejectionReason: 'Claim cancelled by admin' }
      );
    }

    res.status(200).json({
      success: true,
      data: foundItem,
      message: `Found item ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating found item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating found item',
      error: error.message
    });
  }
};

// @desc    Update claim status
// @route   PUT /api/admin/claim/:id
const updateClaimStatus = async (req, res) => {
  try {
    const { status, rejectionReason, adminNotes } = req.body;
    
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }
    
    // Get the found item
    const foundItem = await FoundItem.findById(claim.itemId);
    
    // Update claim status
    const oldStatus = claim.status;
    claim.status = status;
    claim.adminNotes = adminNotes || claim.adminNotes;
    
    if (status === 'approved') {
      claim.verifiedBy = 'admin';
      claim.verifiedAt = new Date();
      claim.pickupCode = claim.pickupCode || generatePickupCode(claim._id);
      
      // Update found item status to claimed if not already
      if (foundItem && foundItem.status === 'approved') {
        foundItem.status = 'claimed';
        foundItem.claimedBy = claim.claimantStudentId;
        foundItem.claimedAt = new Date();
        await foundItem.save();
      }
    } else if (status === 'rejected') {
      claim.rejectionReason = rejectionReason || 'No reason provided';
      
      // IMPORTANT: Revert the found item status back to approved
      if (foundItem && foundItem.status === 'claimed') {
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

        if (emailResult && emailResult.skipped) {
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

// @desc    Delete lost item
// @route   DELETE /api/admin/lost/:id
const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    // Delete associated image
    if (lostItem.imageUrl) {
      await deleteImageFile(lostItem.imageUrl);
    }
    
    await lostItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lost item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lost item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lost item',
      error: error.message
    });
  }
};

// @desc    Delete found item
// @route   DELETE /api/admin/found/:id
const deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Delete associated image
    if (foundItem.imageUrl) {
      await deleteImageFile(foundItem.imageUrl);
    }
    
    // Delete any associated claims
    await Claim.deleteMany({ itemId: foundItem._id });
    
    await foundItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Found item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting found item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting found item',
      error: error.message
    });
  }
};

// @desc    Delete claim
// @route   DELETE /api/admin/claim/:id
const deleteClaim = async (req, res) => {
  try {
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

// @desc    Manually add found item (Admin)
// @route   POST /api/admin/found/manual
const addManualFoundItem = async (req, res) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description
    } = req.body;

    // Validate required fields
    if (!itemName || !category || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get image URL if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, '/');
    }

    // Create found item with admin as finder
    const foundItem = await FoundItem.create({
      fullName: 'Admin',
      studentId: 'ADMIN001',
      email: 'admin@university.edu',
      contactNumber: null,
      itemName,
      category,
      location,
      date: new Date(date),
      description: description || '',
      imageUrl,
      foundBy: 'management',
      status: 'approved', // Auto-approve admin added items
      claimDeadline: new Date(new Date().setDate(new Date().getDate() + 30)) // 30 days deadline
    });

    res.status(201).json({
      success: true,
      data: foundItem,
      message: 'Found item added successfully and published'
    });
  } catch (error) {
    if (req.file) {
      await deleteImageFile(req.file.path);
    }
    
    console.error('Error adding manual found item:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding found item',
      error: error.message
    });
  }
};

// @desc    Get all claims (with filters)
// @route   GET /api/admin/claims
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

// @desc    Get claim statistics
// @route   GET /api/admin/claim-stats
const getClaimStats = async (req, res) => {
  try {
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
      message: 'Error fetching claim statistics',
      error: error.message
    });
  }
};

// @desc    Get single claim by ID (Admin)
// @route   GET /api/admin/claim/:id
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

// @desc    Bulk update claim statuses
// @route   PUT /api/admin/claims/bulk
const bulkUpdateClaims = async (req, res) => {
  try {
    const { claimIds, status, rejectionReason } = req.body;
    
    if (!claimIds || !claimIds.length) {
      return res.status(400).json({
        success: false,
        message: 'No claims selected'
      });
    }
    
    const results = [];
    
    for (const claimId of claimIds) {
      const claim = await Claim.findById(claimId);
      if (claim) {
        const foundItem = await FoundItem.findById(claim.itemId);
        const oldStatus = claim.status;
        
        claim.status = status;
        
        if (status === 'approved') {
          claim.verifiedBy = 'admin';
          claim.verifiedAt = new Date();
          claim.pickupCode = claim.pickupCode || generatePickupCode(claim._id);
          
          if (foundItem && foundItem.status === 'approved') {
            foundItem.status = 'claimed';
            foundItem.claimedBy = claim.claimantStudentId;
            foundItem.claimedAt = new Date();
            await foundItem.save();
          }
        } else if (status === 'rejected') {
          claim.rejectionReason = rejectionReason || 'Bulk rejection';
          
          if (foundItem && foundItem.status === 'claimed') {
            foundItem.status = 'approved';
            foundItem.claimedBy = null;
            foundItem.claimedAt = null;
            await foundItem.save();
          }
        }
        
        await claim.save();

        if (status === 'approved' && oldStatus !== 'approved') {
          try {
            await sendClaimApprovedEmail({
              to: claim.claimantEmail,
              claimantName: claim.claimantFullName,
              itemName: claim.itemName,
              pickupCode: claim.pickupCode,
            });
          } catch (emailError) {
            console.error('Error sending bulk approval email:', emailError);
          }
        }

        results.push({ id: claimId, status: 'success' });
      } else {
        results.push({ id: claimId, status: 'failed', reason: 'Claim not found' });
      }
    }
    
    res.status(200).json({
      success: true,
      data: results,
      message: `Bulk update completed: ${results.filter(r => r.status === 'success').length} updated`
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk update',
      error: error.message
    });
  }
};

// @desc    Export data (CSV)
// @route   GET /api/admin/export/:type
const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    
    let data = [];
    let filename = '';
    
    if (type === 'lost') {
      data = await LostItem.find({});
      filename = 'lost_items_export.csv';
    } else if (type === 'found') {
      data = await FoundItem.find({});
      filename = 'found_items_export.csv';
    } else if (type === 'claims') {
      data = await Claim.find({});
      filename = 'claims_export.csv';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid export type'
      });
    }
    
    // Convert to CSV
    const csvData = data.map(item => JSON.stringify(item)).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getPendingItems,
  getAcceptedItems,
  getPendingClaimsWithImages,
  updateLostItemStatus,
  updateFoundItemStatus,
  updateClaimStatus,
  deleteLostItem,
  deleteFoundItem,
  deleteClaim,
  addManualFoundItem,
  getAllClaims,
  getClaimStats,
  getClaimById,
  bulkUpdateClaims,
  exportData
};