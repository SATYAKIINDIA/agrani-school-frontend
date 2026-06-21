import { User, Membership } from '../types';

/**
 * Resource Access Utility
 * Provides functions to check resource ownership and enforce data isolation
 */

export interface Resource {
  tenantId?: number;
  membershipId?: number;
}

/**
 * Check if user can access a resource
 * @param resource - Resource to check
 * @param activeMembership - Current active membership
 * @param user - Current user
 * @returns True if user can access the resource
 */
export function canAccessResource(
  resource: Resource,
  activeMembership: Membership | null,
  user: User | null
): boolean {
  if (!activeMembership || !user) {
    return false;
  }

  // Super admins can access all resources
  if (user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Check tenant match
  if (resource.tenantId && resource.tenantId !== activeMembership.tenantId) {
    return false;
  }

  // Check membership match if provided
  if (resource.membershipId && resource.membershipId !== activeMembership.id) {
    return false;
  }

  return true;
}

/**
 * Filter resources to only those accessible by current user
 * @param resources - Array of resources to filter
 * @param activeMembership - Current active membership
 * @param user - Current user
 * @returns Filtered array of accessible resources
 */
export function filterAccessibleResources<T extends Resource>(
  resources: T[],
  activeMembership: Membership | null,
  user: User | null
): T[] {
  if (!activeMembership || !user) {
    return [];
  }

  // Super admins can access all resources
  if (user.role === 'SUPER_ADMIN') {
    return resources;
  }

  return resources.filter(resource => {
    // Check tenant match
    if (resource.tenantId && resource.tenantId !== activeMembership.tenantId) {
      return false;
    }

    // Check membership match if provided
    if (resource.membershipId && resource.membershipId !== activeMembership.id) {
      return false;
    }

    return true;
  });
}

/**
 * Add tenant context to API request params
 * @param params - Existing request params
 * @param activeMembership - Current active membership
 * @returns Params with tenant context added
 */
export function addTenantContext(
  params: Record<string, any> = {},
  activeMembership: Membership | null
): Record<string, any> {
  if (!activeMembership) {
    return params;
  }

  return {
    ...params,
    tenantId: activeMembership.tenantId,
    membershipId: activeMembership.id,
  };
}

/**
 * Get tenant-aware query string
 * @param params - Query parameters
 * @param activeMembership - Current active membership
 * @returns Query string with tenant context
 */
export function getTenantQueryString(
  params: Record<string, string> = {},
  activeMembership: Membership | null
): string {
  if (!activeMembership) {
    return new URLSearchParams(params).toString();
  }

  const tenantParams: Record<string, string> = {
    ...params,
    tenantId: activeMembership.tenantId.toString(),
    membershipId: activeMembership.id.toString(),
  };

  return new URLSearchParams(tenantParams).toString();
}
