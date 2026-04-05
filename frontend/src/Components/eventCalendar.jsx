import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
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
    return (
      <div className="w-full max-w-6xl mx-auto px-5 flex justify-center items-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-primary-600">Event Calendar</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-semibold text-sm" 
            onClick={previousMonth}
          >
            ← Previous
          </button>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold text-sm shadow-md" 
            onClick={goToToday}
          >
            Today
          </button>
          <button 
            className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-semibold text-sm" 
            onClick={nextMonth}
          >
            Next →
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-primary-600">{format(currentDate, 'MMMM yyyy')}</h3>
      </div>

      <div className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-4 text-white text-center font-bold text-sm">
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
                className={`min-h-28 p-3 border border-gray-200 transition-all ${ 
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'bg-yellow-50 border-2 border-yellow-400 shadow-inner' : ''} hover:bg-blue-50`}
              >
                <div className={`text-sm font-bold mb-2 ${isToday ? 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded inline-block' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event._id}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border truncate transition-all hover:shadow-md hover:scale-105 transform ${getEventColor(event.category)}`}
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

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <h4 className="font-bold text-lg text-primary-600 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary-600 rounded-full"></span>
          Event Categories
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-blue-300 rounded border-2 border-blue-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Competition</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-green-300 rounded border-2 border-green-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Workshop</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-purple-300 rounded border-2 border-purple-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Musical Event</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-red-300 rounded border-2 border-red-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Religious Event</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-amber-300 rounded border-2 border-amber-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Academic Event</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300 hover:shadow-md transition-all">
            <div className="w-5 h-5 bg-gray-300 rounded border-2 border-gray-500 flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
