import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/axios';
import { Membership } from '../types';

export function useMemberships(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['memberships'],
    queryFn: async () => {
      const res = await api.get('/api/v1/membership/memberships');
      return res.data.memberships as Membership[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false, // Default to enabled
    retry: false,
    throwOnError: false,
  });
}

export function useSwitchMembership() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (membership: Membership) => {
      const res = await api.post('/api/v1/membership/switch-tenant', {
        membershipId: membership.id,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}
