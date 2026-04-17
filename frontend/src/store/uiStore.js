import { create } from 'zustand';

export const useUIStore = create((set) => ({
  societyModal: null, // Holds the societyId if editing or viewing, null if closed
  addSocietyOpen: false,

  filters: {
    category: '',
    search: '',
    page: 1,
  },

  openSocietyModal: (id) => set({ societyModal: id }),
  closeSocietyModal: () => set({ societyModal: null }),

  toggleAddSociety: () => set((state) => ({ addSocietyOpen: !state.addSocietyOpen })),

  setFilter: (key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [key]: value,
      // reset page to 1 if we change category or search
      ...(key !== 'page' ? { page: 1 } : {}) 
    }
  })),

  resetFilters: () => set({ filters: { category: '', search: '', page: 1 } }),
}));
