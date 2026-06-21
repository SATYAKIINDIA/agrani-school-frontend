import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import PrincipalLayout from './layouts/PrincipalLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import ParentLayout from './layouts/ParentLayout';
import Login from './pages/Login';
import SuperAdminLogin from './pages/SuperAdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Handle auth expiration event
function AuthHandler() {
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleAuthExpired = (e) => {
      logout();
      window.location.href = `/login?redirect=${encodeURIComponent(e.detail.redirect)}`;
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [logout]);

  return null;
}

// Role-based route guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthHandler />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/superadmin-login" element={<SuperAdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Super Admin Routes */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminLayout />
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
              <ProtectedRoute allowedRoles={['PRINCIPAL']}>
                <PrincipalLayout />
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
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherLayout />
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
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLayout />
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
              <ProtectedRoute allowedRoles={['PARENT']}>
                <ParentLayout />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
