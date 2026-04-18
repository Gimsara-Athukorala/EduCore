import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Shield } from 'lucide-react';
import { logoutAdmin } from '../../utils/adminAuth';

function SocietyLeaderDashboardShell({ children }) {
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate(0);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#f7f9ff] flex flex-col">
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-2xl border border-blue-100 bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <img src="/assets/EduCore_Logo.png" alt="EduCore logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-blue-600 leading-tight">Society Leader Dashboard</h1>
                <p className="text-xs text-gray-500">Society Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
              >
                <Shield className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-blue-100 bg-white py-6 text-center text-xs text-gray-400">
        <p>© {currentYear} EduCore | Society Leader Dashboard</p>
      </footer>
    </div>
  );
}

export default SocietyLeaderDashboardShell;

SocietyLeaderDashboardShell.propTypes = {
  children: PropTypes.node.isRequired,
};