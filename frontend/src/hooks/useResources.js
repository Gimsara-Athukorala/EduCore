import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useUploadResource = (societyId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, onUploadProgress }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosInstance.post(`/societies/${societyId}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Resource uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['society', societyId] }); // Refresh detail
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload resource.');
    },
  });
};

export const useDeleteResource = (societyId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId) => {
      await axiosInstance.delete(`/societies/${societyId}/resources/${resourceId}`);
      return resourceId;
    },
    // Optimistic Update
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['society', societyId] });
      const previousSociety = queryClient.getQueryData(['society', societyId]);

      if (previousSociety) {
        queryClient.setQueryData(['society', societyId], {
          ...previousSociety,
          resources: previousSociety.resources.filter(r => r._id !== resourceId),
          resourceCount: Math.max(0, (previousSociety.resourceCount || 1) - 1)
        });
      }

      return { previousSociety };
    },
    onError: (err, resourceId, context) => {
      if (context?.previousSociety) {
        queryClient.setQueryData(['society', societyId], context.previousSociety);
      }
      toast.error(err.response?.data?.message || 'Failed to delete resource.');
    },
    onSuccess: () => {
      toast.success('Resource deleted.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['society', societyId] });
    },
  });
};
