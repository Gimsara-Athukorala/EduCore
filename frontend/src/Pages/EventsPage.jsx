import React, { useContext, useState } from 'react';
import CreateEvent from '../Components/createEvent';
import EventList from '../Components/eventList';
import EventCalendar from '../Components/eventCalendar';
import { AuthContext } from '../Context/AuthContext';

function EventsPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [editingEventId, setEditingEventId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { isAdmin } = useContext(AuthContext);

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary px-4 py-12 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Event Management</h1>
          <p className="text-lg text-primary-100">Manage, create, and organize your events</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-24 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-0">
          <div className="flex flex-wrap gap-2 py-4">
            {isAdmin && (
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border-b-2 ${
                  activeTab === 'create'
                    ? 'border-primary-600 text-primary-700 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
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
            )}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border-b-2 ${
                activeTab === 'events'
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border-b-2 ${
                activeTab === 'calendar'
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('calendar')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 2V6M14 2V6M2 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Event Calendar
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'create' && (
            isAdmin ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <CreateEvent
                  eventId={editingEventId}
                  onEventSaved={handleEventSaved}
                  onCancel={editingEventId ? handleCancelEdit : null}
                />
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                Admin only: you need administrator privileges to create or edit events.
              </div>
            )
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
    </div>
  );
}

export default EventsPage;
