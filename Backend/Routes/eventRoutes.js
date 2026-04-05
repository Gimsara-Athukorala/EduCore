const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByDateRange,
  getEventsByCategory
} = require('../controllers/eventController');

// Event routes
router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/range', getEventsByDateRange);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
