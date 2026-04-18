import { useAuthStore } from '../store/authStore';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/i, '')
  .replace(/\/api$/i, '');
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_ROLE_KEY = 'adminRole';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const getAdminRole = () => localStorage.getItem(ADMIN_ROLE_KEY);

export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const setAdminRole = (role) => {
  localStorage.setItem(ADMIN_ROLE_KEY, role);
};

export const removeAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const removeAdminRole = () => {
  localStorage.removeItem(ADMIN_ROLE_KEY);
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const role = getAdminRole();
  return Boolean(token) && role === 'admin';
};

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Login endpoint returned non-JSON response. Check API URL and route configuration.');
  }

  const data = await response.json();

  if (!response.ok || !data.token || !data.user) {
    throw new Error(data.message || 'Login failed');
  }

  const role = data?.user?.role || 'admin';
  const admin = data?.user;

  setAdminToken(data.token);
  setAdminRole(role || 'admin');

  useAuthStore.getState().setAuth(
    {
      _id: admin?.id || admin?._id,
      email: admin?.email,
      role: admin?.role || 'admin',
      fullName: admin?.fullName,
    },
    data.token
  );

  return data;
};

export const logoutAdmin = () => {
  removeAdminToken();
  removeAdminRole();
  useAuthStore.getState().clearAuth();
};
