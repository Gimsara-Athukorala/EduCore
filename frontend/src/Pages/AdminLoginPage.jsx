import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '../utils/adminAuth';
import Toast from '../common/toast.jsx';
import { validateAdminLogin } from '../validator/loginValidator.js';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({ email: '', password: '' });
    setIsLoading(true);

    const { isValid, errors } = validateAdminLogin({ email, password });

    if (!isValid) {
      setFieldErrors({
        email: errors.email || '',
        password: errors.password || '',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginAdmin(email, password);
      const role = response?.data?.admin?.role;

      setShowSuccessToast(true);
      setTimeout(() => {
        if (role === 'society_leader') {
          navigate('/societies/create');
          return;
        }

        navigate('/admin/lost-found');
      }, 900);
    } catch (loginError) {
      setError(loginError.message || 'Unable to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <div className="text-center mb-6">
          <img
            src="/assets/EduCore_Logo.png"
            alt="EduCore logo"
            className="h-24 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to access Lost & Found admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-xl font-medium hover:bg-[#3B82F6] transition disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <Toast
        isOpen={showSuccessToast}
        message="Login successful"
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}

export default AdminLoginPage;
