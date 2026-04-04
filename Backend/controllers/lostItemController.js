const LostItem = require('../Model/LostItem');
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

// @desc    Create a new lost item report
// @route   POST /api/lost-items
const createLostItem = async (req, res) => {
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
      description
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

    // Create lost item
    const lostItem = await LostItem.create({
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
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: lostItem,
      message: 'Lost item reported successfully. It will be reviewed by admin.'
    });
  } catch (error) {
    if (req.file) {
      await deleteImageFile(req.file.path);
    }
    
    console.error('Error creating lost item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lost item report',
      error: error.message
    });
  }
};

// @desc    Get all approved lost items
// @route   GET /api/lost-items
const getLostItems = async (req, res) => {
  try {
    const { limit = 20, page = 1, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'approved' };
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add search filter
    if (search && search.trim()) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const lostItems = await LostItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LostItem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: lostItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lost items',
      error: error.message
    });
  }
};

// @desc    Get single lost item by ID
// @route   GET /api/lost-items/:id
const getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    // Only show approved items to public
    if (lostItem.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'This item is not available for public viewing'
      });
    }

    res.status(200).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    console.error('Error fetching lost item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lost item',
      error: error.message
    });
  }
};

// @desc    Update lost item status
// @route   PUT /api/lost-items/:id/status
const updateLostItemStatus = async (req, res) => {
  try {
    const { status, adminNotes, adminPassword } = req.body;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    // Update status
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
    console.error('Error updating lost item status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lost item status',
      error: error.message
    });
  }
};

// @desc    Delete lost item
// @route   DELETE /api/lost-items/:id
const deleteLostItem = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

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

// @desc    Get all pending items
// @route   GET /api/lost-items/admin/pending
const getPendingItems = async (req, res) => {
  try {
    const { adminPassword } = req.query;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const pendingItems = await LostItem.find({ status: 'pending' })
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

// @desc    Get statistics
// @route   GET /api/lost-items/admin/stats
const getStats = async (req, res) => {
  try {
    const { adminPassword } = req.query;
    
    // Simple admin password check
    if (adminPassword !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    const totalItems = await LostItem.countDocuments();
    const approvedItems = await LostItem.countDocuments({ status: 'approved' });
    const pendingItems = await LostItem.countDocuments({ status: 'pending' });
    const rejectedItems = await LostItem.countDocuments({ status: 'rejected' });
    const resolvedItems = await LostItem.countDocuments({ status: 'resolved' });

    const categoryStats = await LostItem.aggregate([
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

    res.status(200).json({
      success: true,
      data: {
        total: totalItems,
        approved: approvedItems,
        pending: pendingItems,
        rejected: rejectedItems,
        resolved: resolvedItems,
        byCategory: categoryStats
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
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItemStatus,
  deleteLostItem,
  getPendingItems,
  getStats
};