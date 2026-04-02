const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
router.post('/', eventController.createEvent);

// Get all events
router.get('/', eventController.getAllEvents);

// Get events by date range
router.get('/range', eventController.getEventsByDateRange);

// Get events by category
router.get('/category/:category', eventController.getEventsByCategory);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Update event
router.put('/:id', eventController.updateEvent);

// Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
