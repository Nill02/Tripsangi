import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

/* ---------- CONTEXTS ---------- */
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

/* ---------- COMPONENTS ---------- */
import Navbar from './components/Navbar';

/* ---------- USER PAGES ---------- */
import HomePage from './pages/User/HomePage';
import LocationPage from './pages/User/LocationPage';
import LocationDetailPage from './pages/User/LocationDetailPage';
import ExplorePage from './pages/User/ExplorePage';
import RoutePlanningPage from './pages/User/RoutePlanningPage';
import TransportPage from './pages/User/TransportPage';
import HotelsPage from './pages/User/HotelsPage';
import TouristPlacesPage from './pages/User/TouristPlacesPage';

/* ---------- AUTH PAGES ---------- */
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';

/* ---------- ADMIN PAGES ---------- */

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTouristSpots from './pages/admin/AdminTouristSpots';
import AdminLocations from './pages/admin/AdminLocations';
import AdminHotels from './pages/admin/AdminHotels';
import AdminTransports from './pages/admin/AdminTransports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200'>
            <Navbar />

            <Routes>
              {/* ---------- USER ROUTES ---------- */}
              <Route path='/' element={<HomePage />} />

              <Route path='/locations' element={<LocationPage />} />
              <Route path='/locations/:id' element={<LocationDetailPage />} />

              {/* Alias */}
              <Route path='/destinations' element={<LocationPage />} />

              <Route path='/explore/:id' element={<ExplorePage />} />
              <Route path='/route-planning' element={<RoutePlanningPage />} />
              <Route path='/transport' element={<TransportPage />} />
              <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/tourist-places' element={<TouristPlacesPage />} />

              {/* ---------- AUTH ---------- */}
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />

              {/* ---------- ADMIN ROUTES ---------- */}
              <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path='dashboard' element={<AdminDashboard />} />
                <Route path='locations' element={<AdminLocations />} />
                <Route path='hotels' element={<AdminHotels />} />
                <Route path='transports' element={<AdminTransports />} />
                <Route path='tourist-spots' element={<AdminTouristSpots />} />
              </Route>
            </Routes>

            <Toaster position='top-right' />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
