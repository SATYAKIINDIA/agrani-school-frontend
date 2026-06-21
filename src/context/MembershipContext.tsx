import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useMemberships, useSwitchMembership } from '../hooks/useMembershipQuery';
import { Membership } from '../types';
import { MembershipContextValue } from '../types/context';

const MembershipContext = createContext<MembershipContextValue | null>(null);

const ACTIVE_MEMBERSHIP_KEY = 'activeMembershipId';

// Public routes that don't require membership check
const PUBLIC_ROUTES = ['/login', '/superadmin-login', '/forgot-password', '/reset-password', '/unauthorized'];

interface MembershipProviderProps {
  children: ReactNode;
}

/**
 * Membership Provider
 * Manages user's multi-tenant memberships and active membership selection
 */
export function MembershipProvider({ children }: MembershipProviderProps) {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
  const { user, loading: authLoading } = useAuth();
  const { data: memberships = [], isLoading: membershipsLoading } = useMemberships({
    enabled: !isPublicRoute && !!user, // Disable on public routes or when no user
  });
  const switchMembershipMutation = useSwitchMembership();
  
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine active membership when memberships data changes
  useEffect(() => {
    if (!user) {
      setActiveMembership(null);
      setLoading(false);
      return;
    }

    if (!authLoading && !membershipsLoading) {
      // Determine active membership
      const savedMembershipId = localStorage.getItem(ACTIVE_MEMBERSHIP_KEY);
      let active: Membership | undefined;

      if (savedMembershipId) {
        // Try to use saved membership
        active = memberships.find(m => m.id === parseInt(savedMembershipId));
      }

      if (!active) {
        // Fall back to primary or first membership
        active = memberships.find(m => m.isPrimary) || memberships[0];
      }

      if (active) {
        setActiveMembership(active);
        localStorage.setItem(ACTIVE_MEMBERSHIP_KEY, active.id.toString());
      }
      setLoading(false);
    }
  }, [user, authLoading, membershipsLoading, memberships]);

  /**
   * Switch to a different membership
   * @param membership - Membership to switch to
   */
  const switchMembership = useCallback(async (membership: Membership) => {
    try {
      await switchMembershipMutation.mutateAsync(membership);
      
      // Reload user data to get updated permissions
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch membership:', err);
      throw err;
    }
  }, [switchMembershipMutation]);

  const value: MembershipContextValue = useMemo(() => ({
    memberships,
    activeMembership,
    loading: loading || membershipsLoading,
    switchMembership,
  }), [memberships, activeMembership, loading, membershipsLoading, switchMembership]);

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

/**
 * Hook to access membership context
 */
export function useMembership(): MembershipContextValue {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within MembershipProvider');
  }
  return context;
}
