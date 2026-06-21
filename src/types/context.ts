import { User, Membership } from './index';

/**
 * Context Type Definitions
 */

export interface AuthContextValue {
  user: User | null;
  permissions: string[];
  roles: string[];
  membership: {
    id: number;
    tenantId: number;
    isPrimary: boolean;
  } | null;
  memberships: any[] | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface PermissionContextValue {
  permissions: string[];
  user: User | null;
}

export interface MembershipContextValue {
  memberships: Membership[];
  activeMembership: Membership | null;
  loading: boolean;
  switchMembership: (membership: Membership) => Promise<void>;
}
