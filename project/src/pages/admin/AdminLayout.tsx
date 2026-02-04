import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, MapPin, Hotel, Bus, Camera, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  /* 🔒 Protect admin routes */
  if (!user || user.role !== 'admin') {
  ;
  }

  return (
    <div className='min-h-screen flex bg-gray-100 dark:bg-gray-900'>
      {/* ---------- SIDEBAR ---------- */}
      <aside className='w-64 bg-gray-900 text-white flex flex-col'>
        <div className='p-6 text-xl font-bold border-b border-gray-700'>Admin Panel</div>

        <nav className='flex-1 p-4 space-y-2'>
          <AdminLink to='/admin/dashboard' icon={<LayoutDashboard />}>
            Dashboard 
          </AdminLink>

          <AdminLink to='/admin/locations' icon={<MapPin />}>
            Locations
          </AdminLink>

          <AdminLink to='/admin/hotels' icon={<Hotel />}>
            Hotels
          </AdminLink>

          <AdminLink to='/admin/transports' icon={<Bus />}>
            Transports
          </AdminLink>

          <AdminLink to='/admin/tourist-spots' icon={<Camera />}>
            Tourist Spots
          </AdminLink>
        </nav>

        {/* ---------- FOOTER ---------- */}
        <button
          onClick={logout}
          className='flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 transition'
        >
          <LogOut />
          Logout
        </button>
      </aside>

      {/* ---------- CONTENT ---------- */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
}

/* ---------- Sidebar Link ---------- */

function AdminLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
