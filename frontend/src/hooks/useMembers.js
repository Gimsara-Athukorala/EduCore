import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useGetMembers = (slug) => {
  return useQuery({
    queryKey: ['society', slug, 'members'],
    queryFn: async () => {
      // Assuming GET /api/societies/:slug already includes the fully detailed members array.
      // If the backend has a specific endpoint we'd hit that. 
      // For now we will hit the slug and return the members.
      const response = await axiosInstance.get(`/societies/${slug}`);
      return response.data.data.members || [];
    },
    enabled: !!slug,
  });
};

export const useRemoveMember = (slug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      await axiosInstance.delete(`/societies/${slug}/members/${userId}`);
      return userId;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['society', slug] });
      await queryClient.cancelQueries({ queryKey: ['society', slug, 'members'] });

      const previousMembers = queryClient.getQueryData(['society', slug, 'members']);

      if (previousMembers) {
        queryClient.setQueryData(
          ['society', slug, 'members'],
          previousMembers.filter((m) => m.user._id !== userId)
        );
      }

      return { previousMembers };
    },
    onError: (err, userId, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(['society', slug, 'members'], context.previousMembers);
      }
      toast.error('Failed to remove member');
    },
    onSuccess: () => {
      toast.success('Member removed from society');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['society', slug] });
      queryClient.invalidateQueries({ queryKey: ['society', slug, 'members'] });
    },
  });
};

export const usePromoteMember = (slug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await axiosInstance.patch(`/societies/${slug}/members/${userId}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Member role updated');
      queryClient.invalidateQueries({ queryKey: ['society', slug] });
      queryClient.invalidateQueries({ queryKey: ['society', slug, 'members'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update member role');
    },
  });
};
