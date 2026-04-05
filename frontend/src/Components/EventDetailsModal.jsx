import React, { useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { AuthContext } from '../Context/AuthContext';

const EventDetailsModal = ({ event, isOpen, onClose, onEventUpdated }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !event) return null;

  const isEnrolled = isAuthenticated && event.attendees?.includes(user?.name);
  const isPastEvent = new Date(event.endDate) < new Date();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      setError('Please login to enroll in events');
      return;
    }

    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/api/events/${event._id}/enroll`);
      setSuccess('Successfully enrolled in event!');
      // Update the event data
      if (onEventUpdated) {
        const updatedEvent = { ...event };
        if (!updatedEvent.attendees) updatedEvent.attendees = [];
        updatedEvent.attendees.push(user.name);
        onEventUpdated(updatedEvent);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error enrolling in event');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      await axios.delete(`/api/events/${event._id}/enroll`);
      setSuccess('Successfully unenrolled from event!');
      // Update the event data
      if (onEventUpdated) {
        const updatedEvent = { ...event };
        updatedEvent.attendees = updatedEvent.attendees.filter(name => name !== user.name);
        onEventUpdated(updatedEvent);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error unenrolling from event');
    } finally {
      setEnrolling(false);
    }
  };

  const getCategoryBadgeClasses = (category) => {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-semibold';
    const categoryClasses = {
      competition: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      musicalEvent: 'bg-purple-100 text-purple-800',
      religiousEvent: 'bg-red-100 text-red-800',
      academicEvent: 'bg-amber-100 text-amber-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return `${baseClasses} ${categoryClasses[category] || categoryClasses.other}`;
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return `${baseClasses} ${statusClasses[status] || statusClasses.scheduled}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {event.photo ? (
            <div className="w-full h-64 bg-gray-200 overflow-hidden">
              <img
                src={event.photo}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={getStatusBadgeClasses(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Title and Category */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <span className={getCategoryBadgeClasses(event.category)}>
              {event.category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Start Date & Time</p>
                  <p className="text-gray-600">{new Date(event.startDate).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">End Date & Time</p>
                  <p className="text-gray-600">{new Date(event.endDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {event.location && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              )}

              {event.organizer && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Organizer</p>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attendees Count */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="font-medium text-gray-900">
                {event.attendees?.length || 0} attendee{(event.attendees?.length || 0) !== 1 ? 's' : ''} enrolled
              </span>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
              <p className="font-semibold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {!isAuthenticated ? (
              <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 font-medium mb-2">Login Required</p>
                <p className="text-blue-600 text-sm">Please login to enroll in events</p>
              </div>
            ) : isPastEvent ? (
              <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-800 font-medium mb-2">Event Ended</p>
                <p className="text-gray-600 text-sm">This event has already ended</p>
              </div>
            ) : isEnrolled ? (
              <button
                onClick={handleUnenroll}
                disabled={enrolling}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-all transform hover:scale-105 disabled:transform-none"
              >
                {enrolling ? 'Unenrolling...' : 'Unenroll from Event'}
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-all transform hover:scale-105 disabled:transform-none"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Event'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;