import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token) => 
        set({ user, accessToken: token, isAuthenticated: !!user, error: null }),

      clearAuth: () => 
        set({ user: null, accessToken: null, isAuthenticated: false, error: null }),

      updateUser: (partialObj) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialObj } : null,
        })),

      // Asynchronous Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axiosInstance.post('/auth/login', { email, password });
          const { user, accessToken } = res.data.data;
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed. Please try again.';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axiosInstance.post('/auth/register', userData);
          const { user, accessToken } = res.data.data;
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed.';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: async () => {
        try {
          // No need to await if we want it to be snappy, but usually good to call backend
          await axiosInstance.post('/auth/logout');
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          get().clearAuth();
          // Optionally redirecting via window.location.href or handling in component
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated 
      }), 
    }
  )
);
