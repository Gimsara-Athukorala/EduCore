const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create a new event (admin only)
router.post('/', protect, authorize('admin'), eventController.createEvent);

// Get all events (public)
router.get('/', eventController.getAllEvents);

// Get events by date range
router.get('/range', eventController.getEventsByDateRange);

// Get events by category
router.get('/category/:category', eventController.getEventsByCategory);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Enroll in event (authenticated users)
router.post('/:id/enroll', protect, eventController.enrollUser);

// Unenroll from event (authenticated users)
router.delete('/:id/enroll', protect, eventController.unenrollUser);

// Update event (admin only)
router.put('/:id', protect, authorize('admin'), eventController.updateEvent);

// Delete event (admin only)
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);

module.exports = router;
