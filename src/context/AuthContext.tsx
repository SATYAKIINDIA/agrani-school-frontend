import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthMe, useLogin, useLogout } from '../hooks/useAuthQuery';
import { AuthContextValue } from '../types/context';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Public routes that don't require auth check
const PUBLIC_ROUTES = ['/login', '/superadmin-login', '/forgot-password', '/reset-password', '/unauthorized', '/select-tenant', '/select-role'];

export function AuthProvider({ children }: AuthProviderProps) {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
  
  // Only check auth on protected routes
  const { data: authData, isLoading: loading } = useAuthMe({
    enabled: !isPublicRoute, // Disable query on public routes
  });
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const user = authData?.user || null;
  const permissions = authData?.permissions || [];
  const roles = authData?.roles || [];
  const membership = authData?.membership || null;
  const memberships = authData?.memberships || null;

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      const message = 'Login successful';
      console.log('✅', message);
      toast.success(message, { duration: 10000 });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      console.error('❌', message, error);
      toast.error(message, { duration: 10000 });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      const message = 'Logged out successfully';
      console.log('✅', message);
      toast.success(message, { duration: 10000 });
    } catch (error: any) {
      // Don't throw on logout errors - user might already be logged out
      const message = 'Logout failed (may already be logged out)';
      console.debug('⚠️', message, error.message);
    }
  };

  const value: AuthContextValue = useMemo(() => ({
    user,
    permissions,
    roles,
    membership,
    memberships,
    login,
    logout,
    loading,
  }), [user, permissions, roles, membership, memberships, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
