/**
 * Common Type Definitions
 */

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  status: string;
  avatar?: string;
}

export interface Membership {
  id: number;
  tenantId: number;
  userId: number;
  membershipStatus: string;
  membershipType: string;
  isPrimary: boolean;
  isDefault: boolean;
  joinedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  tenant?: Tenant;
  membershipRoles?: MembershipRole[];
}

export interface Tenant {
  id: number;
  tenantName: string;
  tenantCode: string;
  status: string;
  subscriptionStatus: string;
  subscriptionExpiresAt?: string;
}

export interface MembershipRole {
  id: number;
  membershipId: number;
  roleId: number;
  roleCode: string;
  effectiveFrom: string;
  effectiveTo?: string;
  role?: Role;
}

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  rolePermissions?: RolePermission[];
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission?: Permission;
}

export interface Permission {
  id: number;
  permissionCode: string;
  permissionName: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  permissions: string[];
  roles: string[];
  membership: {
    id: number;
    tenantId: number;
    isPrimary: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantCode?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
