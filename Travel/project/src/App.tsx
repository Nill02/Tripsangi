import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use BrowserRouter
import { Toaster } from 'react-hot-toast';

/* ---------- CONTEXTS ---------- */
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

/* ---------- COMPONENTS ---------- */
import Navbar from './components/Navbar';

// add new imports above this line

/* ---------- USER MAIN PAGES ---------- */
import HomePage from './pages/User/HomePage';
import DestinationsPage from './pages/User/DestinationsPage';
import TransportPage from './pages/User/TransportPage';
import HotelsPage from './pages/User/HotelsPage';
import RoutePlanningPage from './pages/User/RoutePlanningPage';

/* ---------- USER SUB PAGES ---------- */
import ExplorePage from './pages/User/ExplorePage';
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

              {/* Main Routes */}
              <Route path='/destinations' element={<DestinationsPage />} />
              <Route path='/destinations/:id' element={<DestinationsPage />} />
              <Route path='/transport' element={<TransportPage />} />
              <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/route-planning' element={<RoutePlanningPage />} />

              {/* Sub Pages */}
              <Route path='/tourist-places' element={<TouristPlacesPage />} />
              <Route path='/explore/:id' element={<ExplorePage />} />

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
