import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

const SidebarNav = ({ links, roleLabel }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 shrink-0 h-screen bg-white border-r border-border flex-col fixed top-0 left-0 hidden md:flex">
      <div className="p-6">
        <div className="text-xl font-display font-bold text-primary-dark tracking-tight mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-dark/10 flex items-center justify-center">
            <span className="text-primary-dark text-lg">🎓</span>
          </div>
          EduCore
        </div>

        <nav className="space-y-1 text-sm font-medium">
          {links.map((link, i) => {
            if (link.isLabel) {
              return (
                <div key={`label-${i}`} className="pt-6 pb-2 text-xs font-bold text-muted tracking-wider uppercase">
                  {link.title}
                </div>
              );
            }

            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                    isActive 
                      ? 'bg-primary-dark/10 text-primary-dark font-bold' 
                      : 'text-muted hover:bg-gray-100 hover:text-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 bg-primary-dark rounded-r-full" />
                    )}
                    {Icon && <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary-dark' : 'group-hover:text-primary')} />}
                    {link.title}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border bg-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary truncate" title={user?.name}>
              {user?.name}
            </p>
            <p className="text-xs text-muted font-medium truncate">
              {roleLabel || 'Student'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

SidebarNav.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    isLabel: PropTypes.bool,
    title: PropTypes.string,
    to: PropTypes.string,
    icon: PropTypes.elementType
  })).isRequired,
  roleLabel: PropTypes.string
};

export default SidebarNav;
