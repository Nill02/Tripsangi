import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Car, Hotel, Route, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../../uploads/admin/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className='bg-white dark:bg-[#071028] shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-4'>
            <Link to='/' className='flex items-center gap-3'>
              <div className='w-10 h-10 flex items-center justify-center'>
                <img src={logo} alt="TripSangi" className="w-full h-full object-contain" />
              </div>

              <span className='text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>TripSangi</span>
            </Link>

            <div className='hidden md:flex items-center space-x-4'>
              <Link to='/destinations' className='flex items-center px-3 py-2 rounded-md text-primary hover:text-secondary'>
                <MapPin className='h-5 w-5 mr-2 text-primary' />
                <span>Destinations</span>
              </Link>
              <Link to='/transport' className='flex items-center px-3 py-2 rounded-md text-primary hover:text-secondary'>
                <Car className='h-5 w-5 mr-2 text-primary' />
                <span>Transport</span>
              </Link>
              <Link to='/hotels' className='flex items-center px-3 py-2 rounded-md text-primary hover:text-secondary'>
                <Hotel className='h-5 w-5 mr-2 text-primary' />
                <span>Hotels</span>
              </Link>
              <Link to='/route-planning' className='flex items-center px-3 py-2 rounded-md text-primary hover:text-secondary'>
                <Route className='h-5 w-5 mr-2 text-primary' />
                <span>Route Planning</span>
              </Link>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='hidden md:flex items-center space-x-3'>
              <button onClick={toggleTheme} aria-label='Toggle theme' className='p-2 rounded-md hover:bg-primary/10'>
                {theme === 'dark' ? <Sun className='h-5 w-5 text-yellow-400' /> : <Moon className='h-5 w-5 text-gray-700' />}
              </button>

              {user ? (
                <>
                  <span className='text-gray-700 dark:text-gray-200'>Hi, {user.name}</span>
                  <button onClick={handleLogout} className='btn btn-ghost'>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to='/login' className='px-4 py-2 rounded-md border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors'>
                    Login
                  </Link>
                  <Link to='/register' className='px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition-colors shadow-sm'>
                    Register
                  </Link>
                </>
              )}
            </div>

            <button className='md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200' onClick={() => setOpen((s) => !s)} aria-label='Toggle menu'>
              {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {open && (
          <div className='md:hidden mt-2 pb-4'>
            <div className='flex flex-col space-y-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <Link to='/' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md text-primary hover:text-secondary'>Home</Link>
                </div>
                <button onClick={toggleTheme} aria-label='Toggle theme' className='p-2 rounded-md hover:bg-primary/10'>
                  {theme === 'dark' ? <Sun className='h-5 w-5 text-yellow-400' /> : <Moon className='h-5 w-5 text-gray-700' />}
                </button>
              </div>

              <Link to='/destinations' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md text-primary hover:text-secondary'>Destinations</Link>
              <Link to='/transport' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md text-primary hover:text-secondary'>Transport</Link>
              <Link to='/hotels' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md text-primary hover:text-secondary'>Hotels</Link>
              <Link to='/route-planning' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md text-primary hover:text-secondary'>Route Planning</Link>
              {user ? (
                <button onClick={() => { setOpen(false); handleLogout(); }} className='mt-2 px-3 py-2 btn btn-ghost'>Logout</button>
              ) : (
                <div className='mt-2 flex gap-2'>
                  <Link to='/login' onClick={() => setOpen(false)} className='px-3 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors'>Login</Link>
                  <Link to='/register' onClick={() => setOpen(false)} className='px-3 py-2 rounded-md bg-primary text-white hover:bg-secondary transition-colors'>Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
