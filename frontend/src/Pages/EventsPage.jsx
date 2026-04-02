import React, { useState } from 'react';
import CreateEvent from '../Components/createEvent';
import EventList from '../Components/eventList';
import EventCalendar from '../Components/eventCalendar';

function EventsPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [editingEventId, setEditingEventId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEventSaved = () => {
    setEditingEventId(null);
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('events');
  };

  const handleEditEvent = (eventId) => {
    setEditingEventId(eventId);
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setActiveTab('events');
  };

  const handleSelectEvent = (eventId) => {
    handleEditEvent(eventId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-secondary px-5 py-12 text-white">
        <h1 className="text-4xl font-bold mb-3">Event Management</h1>
        <p className="text-lg text-gray-100">Manage, create, and organize your  events</p>
      </div>

      <nav className="flex flex-wrap gap-3 px-5 py-4 bg-light border-b border-border">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'create'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-primary-600 border border-primary-600 hover:bg-primary-50'
          }`}
          onClick={() => {
            setActiveTab('create');
            setEditingEventId(null);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {editingEventId ? 'Edit Event' : 'Create Event'}
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'events'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-primary-600 border border-primary-600 hover:bg-primary-50'
          }`}
          onClick={() => setActiveTab('events')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 8H18" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Event List
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'calendar'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-primary-600 border border-primary-600 hover:bg-primary-50'
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 2V6M14 2V6M2 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Event Calendar
        </button>
      </nav>

      <div className="flex-grow px-5 py-8">
        {activeTab === 'create' && (
          <CreateEvent
            eventId={editingEventId}
            onEventSaved={handleEventSaved}
            onCancel={editingEventId ? handleCancelEdit : null}
          />
        )}

        {activeTab === 'events' && (
          <EventList
            onEditEvent={handleEditEvent}
            refreshTrigger={refreshTrigger}
          />
        )}

        {activeTab === 'calendar' && (
          <EventCalendar
            refreshTrigger={refreshTrigger}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </div>
    </div>
  );
}

export default EventsPage;
