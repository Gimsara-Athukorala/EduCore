import React, { createContext, useCallback, useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

export const AuthContext = createContext();

const LOCAL_STORAGE_TOKEN_KEY = 'lms_auth_token';
const LOCAL_STORAGE_USER_KEY = 'lms_user_data';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuthHeader = (tokenValue) => {
    if (tokenValue) {
      axios.defaults.headers.common.Authorization = `Bearer ${tokenValue}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post('/api/auth/login', { email, password });
      const { token: accessToken, user: userData } = data;

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      setAuthHeader(accessToken);

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, role = 'user') => {
    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post('/api/auth/register', { name, email, password, role });
      const { token: accessToken, user: userData } = data;

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      setAuthHeader(accessToken);

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setAuthHeader(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
    } catch (err) {
      console.error('Profile fetch failed', err);
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
