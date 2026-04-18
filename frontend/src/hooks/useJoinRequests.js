import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useCreateJoinRequest = (societySlug) => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(`/societies/${societySlug}/join-requests`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Request has been sent to the admin.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit join request.');
    },
  });
};

export const useGetJoinRequests = (societySlug, enabled = true) => {
  return useQuery({
    queryKey: ['society', societySlug, 'joinRequests'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/societies/${societySlug}/join-requests`);
      return response.data.data || [];
    },
    enabled: !!societySlug && enabled,
  });
};

export const useReviewJoinRequest = (societySlug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, action }) => {
      const response = await axiosInstance.patch(`/societies/${societySlug}/join-requests/${requestId}`, { action });
      return { ...response.data, action };
    },
    onSuccess: (data) => {
      toast.success(
        data?.action === 'approve'
          ? 'Join request approved. Member enrolled.'
          : 'Join request rejected.'
      );
      queryClient.invalidateQueries({ queryKey: ['society', societySlug] });
      queryClient.invalidateQueries({ queryKey: ['society', societySlug, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['society', societySlug, 'joinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['societies'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to review request.');
    },
  });
};
