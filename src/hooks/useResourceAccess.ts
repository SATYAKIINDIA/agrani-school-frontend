import { useMemo } from 'react';
import { useMembership } from '../context/MembershipContext';
import { useAuth } from '../context/AuthContext';
import { canAccessResource, filterAccessibleResources, addTenantContext, getTenantQueryString, Resource } from '../utils/resourceAccess';

/**
 * Hook for resource access control
 * Provides functions to check and filter resources based on tenant/membership context
 */
export function useResourceAccess() {
  const { activeMembership } = useMembership();
  const { user } = useAuth();

  const canAccess = useMemo(() => {
    return (resource: Resource) => canAccessResource(resource, activeMembership, user);
  }, [activeMembership, user]);

  const filterResources = useMemo(() => {
    return <T extends Resource>(resources: T[]) => filterAccessibleResources(resources, activeMembership, user);
  }, [activeMembership, user]);

  const withTenantContext = useMemo(() => {
    return (params: Record<string, any> = {}) => addTenantContext(params, activeMembership);
  }, [activeMembership]);

  const withTenantQueryString = useMemo(() => {
    return (params: Record<string, string> = {}) => getTenantQueryString(params, activeMembership);
  }, [activeMembership]);

  return {
    canAccess,
    filterResources,
    withTenantContext,
    withTenantQueryString,
    activeMembership,
    user,
  };
}

/**
 * Hook to check if a specific resource is accessible
 * @param resource - Resource to check
 * @returns True if resource is accessible
 */
export function useCanAccessResource(resource: Resource): boolean {
  const { activeMembership } = useMembership();
  const { user } = useAuth();

  return useMemo(() => {
    return canAccessResource(resource, activeMembership, user);
  }, [resource, activeMembership, user]);
}

/**
 * Hook to filter resources based on access
 * @param resources - Resources to filter
 * @returns Filtered accessible resources
 */
export function useFilteredResources<T extends Resource>(resources: T[]): T[] {
  const { activeMembership } = useMembership();
  const { user } = useAuth();

  return useMemo(() => {
    return filterAccessibleResources(resources, activeMembership, user);
  }, [resources, activeMembership, user]);
}
