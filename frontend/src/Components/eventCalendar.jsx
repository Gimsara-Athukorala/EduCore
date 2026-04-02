import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addDays,
  addMonths,
  subMonths
} from 'date-fns';

const EventCalendar = ({ refreshTrigger, onSelectEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [currentDate, refreshTrigger]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data.events || []);
      setError('');
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventDateStr = eventDate.toDateString();
      const dayDateStr = day.toDateString();
      return eventDateStr === dayDateStr;
    });
  };

  const getDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventColor = (category) => {
    const colors = {
      competition: 'bg-blue-100 text-blue-700 border-blue-300',
      workshop: 'bg-green-100 text-green-700 border-green-300',
      musicalEvent: 'bg-purple-100 text-purple-700 border-purple-300',
      religiousEvent: 'bg-red-100 text-red-700 border-red-300',
      academicEvent: 'bg-amber-100 text-amber-700 border-amber-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[category] || colors.other;
  };

  const days = getDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading calendar...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-600">Event Calendar</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-medium" onClick={previousMonth}>Previous</button>
          <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium" onClick={goToToday}>Today</button>
          <button className="px-3 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-medium" onClick={nextMonth}>Next</button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 bg-light border border-border rounded-lg">
        <h3 className="text-lg font-bold text-primary-600">{format(currentDate, 'MMMM yyyy')}</h3>
      </div>

      <div className="mb-6 bg-white border border-border rounded-lg overflow-hidden shadow-md">
        <div className="grid grid-cols-7 gap-0 border-b border-border bg-primary-600">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-3 text-white text-center font-semibold text-sm border-r border-primary-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {/* Calendar days */}
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = 
              day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border border-border ${ 
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'bg-yellow-50 border-2 border-yellow-400' : ''}`}
              >
                <div className={`text-sm font-bold mb-1 ${isToday ? 'text-yellow-700' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event._id}
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer border truncate transition-all hover:shadow-md ${getEventColor(event.category)}`}
                      onClick={() => onSelectEvent && onSelectEvent(event._id)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-light border border-border rounded-lg p-4">
        <h4 className="font-bold text-primary-600 mb-4">Categories</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded border border-blue-500"></div>
            <span className="text-sm text-gray-700">Competition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded border border-green-500"></div>
            <span className="text-sm text-gray-700">Workshop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-300 rounded border border-purple-500"></div>
            <span className="text-sm text-gray-700">Musical Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 rounded border border-red-500"></div>
            <span className="text-sm text-gray-700">Religious Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-300 rounded border border-amber-500"></div>
            <span className="text-sm text-gray-700">Academic Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded border border-gray-500"></div>
            <span className="text-sm text-gray-700">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
