import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

function MainHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { label: 'Events', path: '/events' },
    { label: 'Societies', path: '/societies' },
    { label: 'Lost & Found', path: '/lost-found' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' },
    { label: 'About Us', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-lg hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/EduCore_Logo.png" 
              alt="EduCore Logo" 
              className="h-24 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAuthenticated ? (
              <>
                <span className="ml-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {user?.fullName || user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className={`ml-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                  isActive('/admin/login')
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-900" />
            ) : (
              <Menu className="h-6 w-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm font-semibold text-slate-700">
                  {user?.fullName || user?.name || user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/admin/login');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/admin/login')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-white bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Login
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default MainHeader;
