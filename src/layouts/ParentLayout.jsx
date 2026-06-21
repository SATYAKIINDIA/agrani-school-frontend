import { Outlet, Link } from 'react-router-dom';

export default function ParentLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-teal-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Agrani School ERP</span>
              <span className="ml-4 px-2 py-1 bg-teal-800 rounded text-sm">PARENT</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/parent/dashboard" className="hover:bg-teal-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/parent/children" className="hover:bg-teal-700 px-3 py-2 rounded">My Children</Link>
              <Link to="/parent/fees" className="hover:bg-teal-700 px-3 py-2 rounded">Fees</Link>
              <Link to="/logout" className="hover:bg-teal-700 px-3 py-2 rounded">Logout</Link>
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
