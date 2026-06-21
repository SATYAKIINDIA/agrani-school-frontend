import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { PermissionContextValue } from '../types/context';

const PermissionContext = createContext<PermissionContextValue | null>(null);

interface PermissionProviderProps {
  children: ReactNode;
}

/**
 * Permission Provider
 * Provides permissions from backend via AuthContext
 */
export function PermissionProvider({ children }: PermissionProviderProps) {
  const { permissions, user } = useAuth();

  const value: PermissionContextValue = useMemo(() => ({
    permissions,
    user,
  }), [permissions, user]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Hook to access permission context
 */
export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return context;
}

/**
 * Hook to check if user has a specific permission
 * @param permission - Permission to check
 * @returns True if user has permission
 */
export function useHasPermission(permission: string): boolean {
  const { permissions } = usePermissionContext();
  return permissions.includes('*') || permissions.includes(permission);
}

/**
 * Hook to check if user has any of the specified permissions
 * @param permissions - Permissions to check
 * @returns True if user has any of the permissions
 */
export function useHasAnyPermission(permissions: string[]): boolean {
  const { permissions: userPermissions } = usePermissionContext();
  if (userPermissions.includes('*')) return true;
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Hook to check if user has all of the specified permissions
 * @param permissions - Permissions to check
 * @returns True if user has all of the permissions
 */
export function useHasAllPermissions(permissions: string[]): boolean {
  const { permissions: userPermissions } = usePermissionContext();
  if (userPermissions.includes('*')) return true;
  return permissions.every(permission => userPermissions.includes(permission));
}
