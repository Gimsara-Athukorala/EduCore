import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useCreateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log('[useSocietyMutations] Creating society with data:', data);
      console.log('[useSocietyMutations] Axios baseURL:', axiosInstance.defaults.baseURL);
      console.log('[useSocietyMutations] Full URL will be:', `${axiosInstance.defaults.baseURL}/societies`);
      
      const response = await axiosInstance.post('/societies', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] });
      toast.success('Society created successfully!');
    },
    onError: (error) => {
      console.error('[Society Creation Error]', error);
      console.error('[Error Response]', error.response?.data);
      console.error('[Error Status]', error.response?.status);
      console.error('[Error Config]', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      const message = error.response?.data?.message || 'Failed to create society.';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors)) {
        const errorMessages = validationErrors
          .map(e => `${e.field}: ${e.message}`)
          .join(' | ');
        toast.error(errorMessages);
      } else {
        toast.error(message);
      }
    },
  });
};

export const useUpdateSociety = (slug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // we need the society ID based on slug to update? The backend API has PUT /api/societies/:id.
      // Wait, let's assume we pass the ID in the data or we use the passed slug if the backend supports slug updates.
      // The backend societyController.js updateSociety currently takes /:id. We should adapt the hook to pass id.
      const { id, ...updateData } = data;
      const response = await axiosInstance.put(`/societies/${id}`, updateData);
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success('Changes saved');
      queryClient.invalidateQueries({ queryKey: ['society', slug] });
      queryClient.invalidateQueries({ queryKey: ['societies'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save changes.');
    },
  });
};
