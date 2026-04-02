const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  organizer: {
    type: String,
    trim: true,
    maxlength: [50, 'Organizer name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['competition', 'workshop', 'musicalEvent', 'religiousEvent', 'academicEvent', 'other'],
    default: 'other'
  },
  attendees: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  photo: {
    type: String, // URL or base64 string
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'events'
});

// Index for better query performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for event duration in hours
eventSchema.virtual('duration').get(function() {
  return Math.round((this.endDate - this.startDate) / (1000 * 60 * 60) * 10) / 10;
});

// Instance method to check if event is upcoming
eventSchema.methods.isUpcoming = function() {
  return this.startDate > new Date();
};

// Static method to find events by date range
eventSchema.statics.findByDateRange = function(start, end) {
  return this.find({
    startDate: { $gte: start },
    endDate: { $lte: end }
  });
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
