const Event = require('../Model/eventModel');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, organizer, category, attendees, photo } = req.body;

    // Validation
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date, and end date are required' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      category,
      attendees: attendees || [],
      photo: photo || null
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const sorted = events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    res.status(200).json({
      message: 'Events retrieved successfully',
      events: sorted
    });
  } catch (error) {
    console.error('Get all error:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event retrieved successfully',
      event
    });
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({ message: 'Error retrieving event', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, location, organizer, category, attendees, status, photo } = req.body;

    // Validation
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const updateData = {
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      category,
      attendees,
      status,
      photo
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event deleted successfully',
      event
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Enroll user in event
exports.enrollUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware
    const userName = req.user.name; // From auth middleware

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already enrolled
    if (event.attendees.includes(userName)) {
      return res.status(400).json({ message: 'User already enrolled in this event' });
    }

    // Add user to attendees
    event.attendees.push(userName);
    await event.save();

    res.status(200).json({
      message: 'Successfully enrolled in event',
      event
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Error enrolling in event', error: error.message });
  }
};

// Unenroll user from event
exports.unenrollUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userName = req.user.name;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is enrolled
    const attendeeIndex = event.attendees.indexOf(userName);
    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'User not enrolled in this event' });
    }

    // Remove user from attendees
    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.status(200).json({
      message: 'Successfully unenrolled from event',
      event
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ message: 'Error unenrolling from event', error: error.message });
  }
};

// Get events by date range
exports.getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const events = await Event.find({
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    }).sort({ startDate: 1 });

    res.status(200).json({
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Date range error:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const events = await Event.find({ category }).sort({ startDate: 1 });

    res.status(200).json({
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Category error:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};
