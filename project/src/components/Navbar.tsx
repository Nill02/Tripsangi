import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Car, Hotel, Route, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-4'>
            <Link to='/' className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-700'>
                {!logoError ? (
                  <img
                    src='/uploads/admin/logo.png'
                    alt='TripSangi'
                    className='w-full h-full object-cover'
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold'>
                    TS
                  </div>
                )}
              </div>

              <span className='text-xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
                TripSangi
              </span>
            </Link>

            <div className='hidden md:flex items-center space-x-4'>
              <Link
                to='/locations'
                className='flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                <MapPin className='h-5 w-5 mr-2' />
                <span>Destinations</span>
              </Link>
              <Link
                to='/transport'
                className='flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                <Car className='h-5 w-5 mr-2' />
                <span>Transport</span>
              </Link>
              <Link
                to='/hotels'
                className='flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                <Hotel className='h-5 w-5 mr-2' />
                <span>Hotels</span>
              </Link>
              <Link
                to='/route-planning'
                className='flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                <Route className='h-5 w-5 mr-2' />
                <span>Route Planning</span>
              </Link>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='hidden md:flex items-center space-x-3'>
              <button
                onClick={toggleTheme}
                aria-label='Toggle theme'
                className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                {theme === 'dark' ? (
                  <Sun className='h-5 w-5 text-yellow-400' />
                ) : (
                  <Moon className='h-5 w-5 text-gray-600' />
                )}
              </button>

              {user ? (
                <>
                  <span className='text-gray-700 dark:text-gray-300'>Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    to='/signup'
                    className='px-3 py-2 rounded-md bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors'
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              className='md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => setOpen((s) => !s)}
              aria-label='Toggle menu'
            >
              {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {open && (
          <div className='md:hidden mt-2 pb-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col space-y-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <Link
                    to='/'
                    onClick={() => setOpen(false)}
                    className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Home
                  </Link>
                </div>
                <button
                  onClick={toggleTheme}
                  aria-label='Toggle theme'
                  className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  {theme === 'dark' ? (
                    <Sun className='h-5 w-5 text-yellow-400' />
                  ) : (
                    <Moon className='h-5 w-5 text-gray-600' />
                  )}
                </button>
              </div>

              <Link
                to='/locations'
                onClick={() => setOpen(false)}
                className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                Locations
              </Link>
              <Link
                to='/transport'
                onClick={() => setOpen(false)}
                className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                Transport
              </Link>
              <Link
                to='/hotels'
                onClick={() => setOpen(false)}
                className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                Hotels
              </Link>
              <Link
                to='/route-planning'
                onClick={() => setOpen(false)}
                className='px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                Route Planning
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className='mt-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors'
                >
                  Logout
                </button>
              ) : (
                <div className='mt-2 flex gap-2'>
                  <Link
                    to='/login'
                    onClick={() => setOpen(false)}
                    className='px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    to='/signup'
                    onClick={() => setOpen(false)}
                    className='px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors'
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
