const FoundItem = require('../Model/FoundItem');
const fs = require('fs').promises;
const path = require('path');

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

// @desc    Create a new found item report
// @route   POST /api/found-items
const createFoundItem = async (req, res) => {
  try {
    const {
      fullName,
      studentId,
      email,
      contactNumber,
      itemName,
      category,
      location,
      date,
      description,
      foundBy
    } = req.body;

    // Validate required fields
    if (!fullName || !studentId || !email || !itemName || !category || !location || !date) {
      if (req.file) {
        await deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.file) {
        await deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate student ID format (STU followed by 10 digits)
    const studentIdRegex = /^STU\d{10}$/i;
    if (!studentIdRegex.test(studentId)) {
      if (req.file) {
        await deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Student ID must begin with STU followed by exactly 10 digits (e.g., STU2024123456)'
      });
    }

    // Validate name (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullName.trim())) {
      if (req.file) {
        await deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Full name can only contain letters and spaces'
      });
    }

    // Validate date (cannot be future)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      if (req.file) {
        await deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Date cannot be in the future'
      });
    }

    // Get image URL if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, '/');
    }

    // Calculate claim deadline (30 days from now for management items)
    let claimDeadline = null;
    if (foundBy === 'management') {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);
      claimDeadline = deadline;
    }

    // Create found item
    const foundItem = await FoundItem.create({
      fullName: fullName.trim(),
      studentId: studentId.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      contactNumber: contactNumber || null,
      itemName: itemName.trim(),
      category,
      location: location.trim(),
      date: new Date(date),
      description: description ? description.trim() : '',
      imageUrl,
      foundBy: foundBy || 'student',
      status: 'pending',
      claimDeadline
    });

    res.status(201).json({
      success: true,
      data: foundItem,
      message: 'Found item reported successfully. It will be reviewed by admin.'
    });
  } catch (error) {
    if (req.file) {
      await deleteImageFile(req.file.path);
    }
    
    console.error('Error creating found item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating found item report',
      error: error.message
    });
  }
};

// @desc    Get all approved found items
// @route   GET /api/found-items
const getFoundItems = async (req, res) => {
  try {
    const { limit = 20, page = 1, category, search, foundBy } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'approved' };
    
    // Filter by foundBy (student or management)
    if (foundBy && foundBy !== 'All') {
      query.foundBy = foundBy;
    }
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add search filter
    if (search && search.trim()) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const foundItems = await FoundItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FoundItem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: foundItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching found items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching found items',
      error: error.message
    });
  }
};

// @desc    Get single found item by ID
// @route   GET /api/found-items/:id
const getFoundItemById = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Only show approved items to public
    if (foundItem.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'This item is not available for public viewing'
      });
    }

    res.status(200).json({
      success: true,
      data: foundItem
    });
  } catch (error) {
    console.error('Error fetching found item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching found item',
      error: error.message
    });
  }
};

// @desc    Update found item status (Admin only)
// @route   PUT /api/found-items/:id/status
const updateFoundItemStatus = async (req, res) => {
  try {
    const { status, adminNotes, adminPassword } = req.body;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Update status
    foundItem.status = status;
    if (adminNotes) {
      foundItem.adminNotes = adminNotes;
    }
    
    await foundItem.save();

    res.status(200).json({
      success: true,
      data: foundItem,
      message: `Found item ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating found item status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating found item status',
      error: error.message
    });
  }
};

// @desc    Claim a found item
// @route   POST /api/found-items/:id/claim
const claimFoundItem = async (req, res) => {
  try {
    const { claimantName, claimantStudentId, claimantEmail, claimantContact } = req.body;
    
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Check if item is available for claim
    if (foundItem.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This item is not available for claim'
      });
    }

    // Check if claim deadline has passed for management items
    if (foundItem.foundBy === 'management' && foundItem.claimDeadline) {
      const now = new Date();
      if (now > foundItem.claimDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Claim deadline has passed for this item'
        });
      }
    }

    // Update item status to claimed
    foundItem.status = 'claimed';
    foundItem.claimedBy = claimantStudentId;
    foundItem.claimedAt = new Date();
    foundItem.claimantInfo = {
      name: claimantName,
      studentId: claimantStudentId,
      email: claimantEmail,
      contact: claimantContact
    };
    
    await foundItem.save();

    res.status(200).json({
      success: true,
      data: foundItem,
      message: 'Item claimed successfully! Please visit the designated office to collect your item.'
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    res.status(500).json({
      success: false,
      message: 'Error claiming item',
      error: error.message
    });
  }
};

// @desc    Mark item as returned
// @route   PUT /api/found-items/:id/return
const markAsReturned = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    foundItem.status = 'returned';
    await foundItem.save();

    res.status(200).json({
      success: true,
      data: foundItem,
      message: 'Item marked as returned successfully'
    });
  } catch (error) {
    console.error('Error marking item as returned:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking item as returned',
      error: error.message
    });
  }
};

// @desc    Delete found item (Admin only)
// @route   DELETE /api/found-items/:id
const deleteFoundItem = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

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

// @desc    Get all pending items (Admin only)
// @route   GET /api/found-items/admin/pending
const getPendingItems = async (req, res) => {
  try {
    const { adminPassword } = req.query;
    
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const pendingItems = await FoundItem.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingItems
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

// @desc    Get statistics (Admin only)
// @route   GET /api/found-items/admin/stats
const getStats = async (req, res) => {
  try {
    const { adminPassword } = req.query;
    
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const totalItems = await FoundItem.countDocuments();
    const approvedItems = await FoundItem.countDocuments({ status: 'approved' });
    const pendingItems = await FoundItem.countDocuments({ status: 'pending' });
    const claimedItems = await FoundItem.countDocuments({ status: 'claimed' });
    const returnedItems = await FoundItem.countDocuments({ status: 'returned' });
    const rejectedItems = await FoundItem.countDocuments({ status: 'rejected' });

    const categoryStats = await FoundItem.aggregate([
      {
        $match: { status: 'approved' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const foundByStats = await FoundItem.aggregate([
      {
        $group: {
          _id: '$foundBy',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalItems,
        approved: approvedItems,
        pending: pendingItems,
        claimed: claimedItems,
        returned: returnedItems,
        rejected: rejectedItems,
        byCategory: categoryStats,
        byFoundBy: foundByStats
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

module.exports = {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItemStatus,
  claimFoundItem,
  markAsReturned,
  deleteFoundItem,
  getPendingItems,
  getStats
};