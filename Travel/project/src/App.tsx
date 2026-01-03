import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use BrowserRouter
import { Toaster } from 'react-hot-toast';

/* ---------- CONTEXTS ---------- */
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

/* ---------- COMPONENTS ---------- */
import Navbar from './components/Navbar';

/* ---------- USER PAGES ---------- */
import HomePage from './pages/User/HomePage';
import LocationPage from './pages/User/LocationPage';
import ExplorePage from './pages/User/ExplorePage';
import RoutePlanningPage from './pages/User/RoutePlanningPage';
import TransportPage from './pages/User/TransportPage';
import HotelsPage from './pages/User/HotelsPage';
import TouristPlacesPage from './pages/User/TouristPlacesPage';

/* ---------- AUTH PAGES ---------- */
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';

function App() {
  return (
    // Only use ONE Router wrapper (BrowserRouter)
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />

              {/* Added /destinations as an alias so the link doesn't break */}
              <Route path='/locations' element={<LocationPage />} />
              <Route path='/destinations' element={<LocationPage />} />

              {/* Updated Explore path to match your navigate calls */}
              <Route path='/explore/:id' element={<ExplorePage />} />
              <Route path='/locations/:locationId' element={<ExplorePage />} />

              <Route path='/route-planning' element={<RoutePlanningPage />} />
              <Route path='/transport' element={<TransportPage />} />
              <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/tourist-places' element={<TouristPlacesPage />} />

              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
            <Toaster position='top-right' />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
