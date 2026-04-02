import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateEvent = ({ eventId, onEventSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    category: 'other',
    attendees: '',
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId]);

  const fetchEventData = async (id) => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      const event = response.data.event;
      
      // Format dates properly for input fields
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location || '',
        organizer: event.organizer || '',
        category: event.category,
        attendees: event.attendees.join(', '),
        photo: event.photo || null
      });
      if (event.photo) {
        setPhotoPreview(event.photo);
      }
    } catch (err) {
      setError('Error fetching event data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
        setPhotoPreview(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
    setPhotoPreview('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        organizer: formData.organizer,
        category: formData.category,
        attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a),
        photo: formData.photo
      };

      if (eventId) {
        await axios.put(`/api/events/${eventId}`, eventData);
        setSuccess('Event updated successfully!');
      } else {
        await axios.post('/api/events', eventData);
        setSuccess('Event created successfully!');
      }

      console.log('Event saved with photo:', eventData.photo ? 'Yes' : 'No');
      setTimeout(() => {
        if (onEventSaved) {
          onEventSaved();
        }
        // Reset form after saving
        handleReset();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      organizer: '',
      category: 'competition',
      attendees: '',
      photo: null
    });
    setPhotoPreview('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-primary-600 mb-6">{eventId ? 'Edit Event' : 'Create New Event'}</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-primary-600 mb-2">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-primary-600 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows="3"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-primary-600 mb-2">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-primary-600 mb-2">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-primary-600 mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="organizer" className="block text-sm font-semibold text-primary-600 mb-2">Organizer</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Enter organizer name"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-primary-600 mb-2">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white"
            >
              <option value="competition">Competition</option>
              <option value="workshop">Workshop</option>
              <option value="musicalEvent">Musical Event</option>
              <option value="religiousEvent">Religious Event</option>
              <option value="academicEvent">Academic Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="attendees" className="block text-sm font-semibold text-primary-600 mb-2">Attendees (comma-separated)</label>
            <textarea
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="Enter attendee names separated by commas"
              rows="2"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-semibold text-primary-600 mb-2">Event Photo</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
          </div>

          {photoPreview && (
            <div className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-primary-600">Photo Preview</h4>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all font-medium text-sm"
                  onClick={handleRemovePhoto}
                >
                  ✕ Remove
                </button>
              </div>
              <img src={photoPreview} alt="Event preview" className="w-full h-auto rounded max-h-96 object-cover" />
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Saving...' : (eventId ? 'Update Event' : 'Create Event')}
            </button>
            <button 
              type="reset"
              onClick={handleReset}
              className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-all"
            >
              Reset
            </button>
            {onCancel && (
              <button 
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
