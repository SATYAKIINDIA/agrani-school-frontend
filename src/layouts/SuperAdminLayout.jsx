import { Outlet, Link } from 'react-router-dom';

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Agrani School ERP</span>
              <span className="ml-4 px-2 py-1 bg-purple-800 rounded text-sm">SUPER_ADMIN</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/superadmin/dashboard" className="hover:bg-purple-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/superadmin/schools" className="hover:bg-purple-700 px-3 py-2 rounded">Schools</Link>
              <Link to="/superadmin/users" className="hover:bg-purple-700 px-3 py-2 rounded">Users</Link>
              <Link to="/logout" className="hover:bg-purple-700 px-3 py-2 rounded">Logout</Link>
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
