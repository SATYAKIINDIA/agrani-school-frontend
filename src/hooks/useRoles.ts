import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';

export interface Role {
  value: string;
  label: string;
  description?: string;
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/api/v1/auth/roles');
      return res.data.roles as Role[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour - roles don't change often
    retry: false,
  });
}
