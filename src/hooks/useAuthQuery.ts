import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';

export function useAuthMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.get('/api/v1/auth/me');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401/400
    refetchOnWindowFocus: false, // Don't refetch on window focus
    throwOnError: false, // Don't throw errors - handle gracefully
    enabled: options?.enabled !== false, // Default to enabled
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.post('/api/v1/membership/login', credentials);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/v1/auth/logout');
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
