import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useCreateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post('/societies', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] });
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
