import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

function Header({ setCurrentPage, isAuthenticated, user, onLogout }) {
  const { isAdmin } = useContext(AuthContext);

  const handleEventClick = () => {
    if (isAuthenticated && isAdmin) {
      setCurrentPage('events'); // Admin events page
    } else {
      setCurrentPage('events'); // Regular events page
    }
    window.scrollTo(0, 0);
  };

  const handleHomeClick = () => {
    if (isAuthenticated && isAdmin) {
      setCurrentPage('dashboard'); // Admin dashboard
    } else {
      setCurrentPage('home'); // Regular home
    }
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-600 to-secondary shadow-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-24">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/EduCore_Logo.png"
              alt="EduCore Logo"
              className="w-40 h-40 object-contain flex-shrink-0"
            />
            <div className="flex flex-col gap-0">
              <h1 className="text-xl font-bold text-white leading-tight">EduCore</h1>
              <p className="text-xs font-medium opacity-85 uppercase tracking-wide">Learning Event Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-8 items-center flex-1 ml-10 hidden lg:flex">
            <button onClick={handleHomeClick} className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Home</button>
            <button onClick={handleEventClick} className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Events</button>
            <a href="#about" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">About</a>
            <a href="#help" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Help</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto text-sm text-white">
            {user ? (
              <>
                <span className="px-3 py-2 bg-white/15 rounded-lg">{user.name} ({user.role})</span>
                <button
                  onClick={() => onLogout()}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;