import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleEventClick = () => {
    navigate('/events');
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-100 bg-gradient-to-r from-primary-600 to-secondary shadow-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-24">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/EduCore_Logo.png"
              alt="EduCore Logo"
              className="w-24 h-24 object-contain flex-shrink-0"
              style={{ border: '2px solid rgba(255,255,255,0.8)' }}
            />
            <div className="flex flex-col gap-0">
              <h1 className="text-xl font-bold text-white leading-tight">EduCore</h1>
              <p className="text-xs font-medium opacity-85 uppercase tracking-wide">Learning Event Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-8 items-center flex-1 ml-10 hidden lg:flex">
            <Link to="/" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Home</Link>
            <button onClick={handleEventClick} className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Events</button>
            <Link to="/lost-found" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Lost & Found</Link>
            <a href="#about" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">About</a>
            <a href="#help" className="text-white text-sm font-medium pb-2 border-b-2 border-transparent hover:opacity-80 transition-all duration-300">Help</a>
          </nav>

          {/* Actions */}
          <div className="flex gap-3 items-center ml-auto">
            <button className="flex items-center justify-center w-10 h-10 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-all" title="Search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 12L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <Link to="/admin/lost-found" className="flex items-center justify-center w-10 h-10 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-all" title="Admin Panel">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 17C3 13.5 6.2 11 10 11C13.8 11 17 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;