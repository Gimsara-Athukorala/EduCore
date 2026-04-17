import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useGetSociety = (slug) => {
  return useQuery({
    queryKey: ['society', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/societies/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useJoinSociety = (slug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/societies/${slug}/join`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Successfully joined the society!');
      queryClient.invalidateQueries({ queryKey: ['society', slug] });
      queryClient.invalidateQueries({ queryKey: ['societies'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to join society.');
    },
  });
};

export const useLeaveSociety = (slug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/societies/${slug}/leave`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Successfully left the society.');
      queryClient.invalidateQueries({ queryKey: ['society', slug] });
      queryClient.invalidateQueries({ queryKey: ['societies'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to leave society.');
    },
  });
};

export const useDeleteSociety = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/societies/${id}`);
    },
    onSuccess: () => {
      toast.success('Society deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['societies'] });
      navigate('/societies');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete society.');
    },
  });
};
