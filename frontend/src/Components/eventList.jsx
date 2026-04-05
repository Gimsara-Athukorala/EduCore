import React, { useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { AuthContext } from '../Context/AuthContext';
import EventDetailsModal from './EventDetailsModal';

const EventList = ({ onEditEvent, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { isAdmin, isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      const fetchedEvents = response.data.events || [];
      console.log('Events fetched:', fetchedEvents.length);
      console.log('First event has photo:', fetchedEvents[0]?.photo ? 'Yes' : 'No');
      setEvents(fetchedEvents);
      setError('');
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        setEvents(events.filter(e => e._id !== eventId));
      } catch (err) {
        setError('Error deleting event');
      }
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map(event =>
      event._id === updatedEvent._id ? updatedEvent : event
    ));
    setSelectedEvent(updatedEvent);
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'startDate':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryBadgeClasses = (category) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
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

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading events...</div>;
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Filter Events</h3>
          <span className="text-sm text-gray-600">Found {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-medium text-gray-700">Search:</label>
            <input
              type="text"
              id="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">Category:</label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white"
            >
              <option value="all">All Categories</option>
              <option value="competition">Competition</option>
              <option value="workshop">Workshop</option>
              <option value="musicalEvent">Musical Event</option>
              <option value="religiousEvent">Religious Event</option>
              <option value="academicEvent">Academic Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white"
            >
              <option value="startDate">Start Date</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No events found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => {
            const isEnrolled = isAuthenticated && event.attendees?.includes(user?.name);
            const isPastEvent = new Date(event.endDate) < new Date();

            return (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group relative z-0 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
              {/* Event Image */}
              {event.photo ? (
                <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
                  <img 
                    src={event.photo} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <div className="p-5">
                {/* Title and Category */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-grow">{event.title}</h3>
                </div>
                
                {/* Category Badge */}
                <div className="mb-3">
                  <span className={getCategoryBadgeClasses(event.category)}>
                    {event.category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                )}

                {/* Event Details */}
                <div className="space-y-2 mb-5 text-sm border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700 truncate">{event.location}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 truncate">{event.organizer}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  {isAdmin ? (
                    <>
                      <button
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event._id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event._id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex gap-2">
                      {!isAuthenticated ? (
                        <div className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-center text-sm">
                          Login to enroll
                        </div>
                      ) : isPastEvent ? (
                        <div className="w-full px-3 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium text-center text-sm">
                          Event ended
                        </div>
                      ) : isEnrolled ? (
                        <div className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-center text-sm flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Enrolled
                        </div>
                      ) : (
                        <button 
                          className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )        })}
        </div>
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default EventList;
