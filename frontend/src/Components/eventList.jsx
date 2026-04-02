import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventList = ({ onEditEvent, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');

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
      <h2 className="text-2xl font-bold text-primary-600 mb-6">Events</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-light p-4 rounded-lg border border-border">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-semibold text-primary-600">Search:</label>
          <input
            type="text"
            id="search"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category-filter" className="text-sm font-semibold text-primary-600">Category:</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white"
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
          <label htmlFor="sort-by" className="text-sm font-semibold text-primary-600">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white"
          >
            <option value="startDate">Start Date</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-light rounded-lg border-2 border-dashed border-border">
          <p className="text-gray-600 text-lg">No events found. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-border">
              {event.photo ? (
                <div className="w-full h-40 bg-gray-200 overflow-hidden">
                  <img 
                    src={event.photo} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              
              <div className="p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-lg font-bold text-primary-600 flex-grow">{event.title}</h3>
                  <span className={getCategoryBadgeClasses(event.category)}>
                    {event.category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary-600">Start:</span>
                    <span className="text-gray-700">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary-600">End:</span>
                    <span className="text-gray-700">{formatDate(event.endDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-primary-600">Location:</span>
                      <span className="text-gray-700">{event.location}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-primary-600">Organizer:</span>
                      <span className="text-gray-700">{event.organizer}</span>
                    </div>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-primary-600">Attendees:</span>
                      <span className="text-gray-700 text-right">{event.attendees.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all transform hover:scale-105"
                    onClick={() => onEditEvent(event._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-all"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
