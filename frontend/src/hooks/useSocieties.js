import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

const fetchSocieties = async (filters) => {
  const { category, search, page, limit = 12 } = filters;
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  if (page) params.append('page', String(page));
  params.append('limit', String(limit));

  const response = await axiosInstance.get(`/societies?${params.toString()}`);
  return response.data.data; // Expected { societies, total, page, totalPages }
};

export const useGetSocieties = (filters) => {
  return useQuery({
    queryKey: ['societies', filters],
    queryFn: () => fetchSocieties(filters),
    placeholderData: (previousData) => previousData, // keepPreviousData replacement in v5
  });
};

export const usePrefetchNextPage = (filters) => {
  const queryClient = useQueryClient();

  const prefetchNextPage = (totalPages) => {
    const currentPage = filters.page || 1;
    if (currentPage < totalPages) {
      const nextFilters = { ...filters, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: ['societies', nextFilters],
        queryFn: () => fetchSocieties(nextFilters),
      });
    }
  };

  return prefetchNextPage;
};
