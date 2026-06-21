import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';
import { getNavigationConfig, getColorClasses } from '../config/navigation';
import { MembershipSelector, MembershipBadge } from '../components/MembershipSelector';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AppLayout() {
  const { logout, user } = useAuth();
  const { activeMembership } = useMembership();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Determine role from user or membership
  const role = user?.role || activeMembership?.roles?.[0];
  const config = getNavigationConfig(role);
  const colors = config ? getColorClasses(config.color) : getColorClasses('blue');

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Role Configuration Found</h1>
          <p className="text-gray-600">Please contact administrator for role assignment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className={`${colors.bg} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">Agrani School ERP</span>
              <span className={`px-2 py-1 ${colors.badge} rounded text-sm`}>{config.name}</span>
              <MembershipBadge />
            </div>
            <div className="flex items-center space-x-4">
              {config.navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${colors.hover} px-3 py-2 rounded ${
                    location.pathname === item.path ? 'bg-white/20' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <MembershipSelector />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`${colors.hover} px-3 py-2 rounded text-white bg-transparent border-none cursor-pointer flex items-center gap-2 disabled:opacity-50`}
              >
                {isLoggingOut ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
