import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PermissionProvider, useHasAnyPermission } from './context/PermissionContext';
import { MembershipProvider, useMembership } from './context/MembershipContext';
import { OfflineProvider } from './context/OfflineContext';
import AppLayout from './layouts/AppLayout';
import LoadingSpinner from './components/LoadingSpinner';
import { SYSTEM_ADMIN, STUDENT_READ, STUDENT_WRITE, TEACHER_WRITE, CLASS_READ, CLASS_WRITE, ATTENDANCE_READ, ATTENDANCE_WRITE, GRADE_READ, GRADE_WRITE, FEE_READ } from './constants/permissions';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const SuperAdminLogin = lazy(() => import('./pages/SuperAdminLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const SelectTenant = lazy(() => import('./pages/SelectTenant'));
const SelectRole = lazy(() => import('./pages/SelectRole'));

// Handle auth expiration event
function AuthHandler() {
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleAuthExpired = (e: Event) => {
      const customEvent = e as CustomEvent<{ redirect: string }>;
      const currentPath = location.pathname;
      
      // Don't handle auth expiration on public routes
      const publicRoutes = ['/login', '/superadmin-login', '/forgot-password', '/reset-password', '/unauthorized'];
      if (publicRoutes.some(route => currentPath.startsWith(route))) {
        return;
      }
      
      logout();
      window.location.href = `/login?redirect=${encodeURIComponent(customEvent.detail.redirect)}`;
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [logout, location.pathname]);

  return null;
}

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
}

// Permission-based route guard with membership context
function ProtectedRoute({ children, requiredPermissions }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { activeMembership, loading: membershipLoading } = useMembership();
  const hasPermission = useHasAnyPermission(requiredPermissions || []);

  if (loading || membershipLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!activeMembership) {
    return <Navigate to="/no-membership" replace />;
  }

  if (requiredPermissions && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <OfflineProvider>
        <AuthProvider>
          <MembershipProvider>
            <PermissionProvider>
              <AuthHandler />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/superadmin-login" element={<SuperAdminLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/select-tenant" element={<SelectTenant />} />
                <Route path="/select-role" element={<SelectRole />} />
          
          {/* Super Admin Routes */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute requiredPermissions={[SYSTEM_ADMIN]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Super Admin Dashboard</div>} />
            <Route path="schools" element={<div>Schools Management</div>} />
            <Route path="users" element={<div>Users Management</div>} />
          </Route>

          {/* Principal Routes */}
          <Route
            path="/principal/*"
            element={
              <ProtectedRoute requiredPermissions={[STUDENT_WRITE, TEACHER_WRITE, CLASS_WRITE]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Principal Dashboard</div>} />
            <Route path="teachers" element={<div>Teachers Management</div>} />
            <Route path="students" element={<div>Students Management</div>} />
            <Route path="classes" element={<div>Classes Management</div>} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute requiredPermissions={[CLASS_READ, ATTENDANCE_WRITE, GRADE_WRITE]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Teacher Dashboard</div>} />
            <Route path="classes" element={<div>My Classes</div>} />
            <Route path="attendance" element={<div>Attendance Management</div>} />
            <Route path="grades" element={<div>Grades Management</div>} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute requiredPermissions={[GRADE_READ, ATTENDANCE_READ]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Student Dashboard</div>} />
            <Route path="grades" element={<div>My Grades</div>} />
            <Route path="attendance" element={<div>My Attendance</div>} />
            <Route path="assignments" element={<div>My Assignments</div>} />
          </Route>

          {/* Parent Routes */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute requiredPermissions={[STUDENT_READ, FEE_READ]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<div>Parent Dashboard</div>} />
            <Route path="children" element={<div>My Children</div>} />
            <Route path="fees" element={<div>Fee Information</div>} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        </Suspense>
        </PermissionProvider>
        </MembershipProvider>
      </AuthProvider>
      </OfflineProvider>
    </BrowserRouter>
  );
}

export default App;
