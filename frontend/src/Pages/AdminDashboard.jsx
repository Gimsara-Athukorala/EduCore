import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { AuthContext } from '../Context/AuthContext';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch events
      const eventsResponse = await axios.get('/api/events');
      const events = eventsResponse.data.events || [];

      // Calculate stats
      const now = new Date();
      const upcomingEvents = events.filter(event => new Date(event.startDate) > now);

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalUsers: 1, // This would need a users API endpoint
        recentEvents: events.slice(0, 5) // Most recent events
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to EduCore Admin Panel</h2>
        <p className="text-primary-100">Manage events, users, and system analytics from your dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="📅"
          color="border-blue-500"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon="⏰"
          color="border-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="border-purple-500"
        />
        <StatCard
          title="Active Sessions"
          value="1"
          icon="🔥"
          color="border-orange-500"
        />
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        {stats.recentEvents.length > 0 ? (
          <div className="space-y-3">
            {stats.recentEvents.map((event) => (
              <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()} • {event.category}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No events found</p>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
