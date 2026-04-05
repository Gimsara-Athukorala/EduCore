import React, { useState, useContext } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AdminLayout from './Components/AdminLayout';
import EventsPage from './Pages/EventsPage';
import ContactUsPage from './Pages/ContactUsPage';
import AdminDashboard from './Pages/AdminDashboard';
import AdminEvents from './Pages/AdminEvents';
import AdminUsers from './Pages/AdminUsers';
import Login from './Components/Login';
import Register from './Components/Register';
import { AuthContext } from './Context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);

  // Set default page for admin users
  React.useEffect(() => {
    if (isAuthenticated && isAdmin && currentPage === 'home') {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, isAdmin, currentPage]);

  // If user is admin, show admin panel
  if (isAuthenticated && isAdmin) {
    return (
      <AdminLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {currentPage === 'dashboard' && <AdminDashboard />}
        {currentPage === 'events' && <AdminEvents />}
        {currentPage === 'users' && <AdminUsers />}
        {currentPage === 'analytics' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
        {currentPage === 'settings' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </AdminLayout>
    );
  }

  // Regular user interface
  return (
    <div className="flex flex-col min-h-screen bg-light">
      <Header
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />

      <main className="flex-grow">
        {currentPage === 'home' && <EventsPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'contact' && <ContactUsPage />}
        {currentPage === 'login' && <Login onSuccess={() => setCurrentPage('events')} />}
        {currentPage === 'register' && <Register onSuccess={() => setCurrentPage('events')} />}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
