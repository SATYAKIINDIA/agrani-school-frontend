import { Outlet, Link } from 'react-router-dom';

export default function PrincipalLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Agrani School ERP</span>
              <span className="ml-4 px-2 py-1 bg-blue-800 rounded text-sm">PRINCIPAL</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/principal/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/principal/teachers" className="hover:bg-blue-700 px-3 py-2 rounded">Teachers</Link>
              <Link to="/principal/students" className="hover:bg-blue-700 px-3 py-2 rounded">Students</Link>
              <Link to="/principal/classes" className="hover:bg-blue-700 px-3 py-2 rounded">Classes</Link>
              <Link to="/logout" className="hover:bg-blue-700 px-3 py-2 rounded">Logout</Link>
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
