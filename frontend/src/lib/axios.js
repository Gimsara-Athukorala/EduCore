/* global globalThis */
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {
  const envBaseUrl = globalThis?.process?.env?.REACT_APP_API_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }
  return 'http://localhost:5000/api/v1';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Request Interceptor: Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Silent Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops and handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const res = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        
        // Update store with new token
        useAuthStore.getState().setAuth(useAuthStore.getState().user, accessToken);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed -> Logout user
        useAuthStore.getState().clearAuth();
        globalThis.location.href = '/admin/login';
        throw refreshError;
      }
    }

    throw error;
  }
);

export default axiosInstance;
