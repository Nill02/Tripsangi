import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';
import HomePage from './pages/User/HomePage';
import DestinationsPage from './pages/User/DestinationsPage';
import TransportPage from './pages/User/TransportPage';
import HotelsPage from './pages/User/HotelsPage';
import RoutePlanningPage from './pages/User/RoutePlanningPage';
// import OrderPage from './pages/User/OrderPage';
// import Login from './Login/Login';
// import Signup from './Login/Sineup';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminExplore from './pages/admin/AdminExplore';
// import AdminTouristSpots from './pages/admin/AdminTouristSpots';
// import AdminTransportHotels from './pages/admin/AdminTransportHotels';
// import AdminRoutes from './pages/admin/AdminRoutes';
// import AdminOrders from './pages/admin/AdminOrders';
import ErrorBoundary from './pages/admin/ErrorBoundary';

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <div className='min-h-screen'>
        <Navbar />
         <ErrorBoundary>
          <Routes>
            <Route path='/' element={<HomePage />} />
            {/* <Route path='/explore/:id' element={<ExplorePage />} /> */}
            <Route path='/destinations' element={<DestinationsPage />} />
            <Route path='/destinations/:id' element={<DestinationsPage />} />
            <Route path='/transport' element={<TransportPage />} />
            <Route path='/hotels' element={<HotelsPage />} />
          
            <Route path='/route-planning' element={<RoutePlanningPage />} />

            {/* <Route path='/order' element={<PrivateRoute><OrderPage /></PrivateRoute>} /> */}

            {/* <Route path='/login' element={<Login />} /> */}
            {/* <Route path='/register' element={<Signup />} /> */}

            {/* <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
            {/* <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
            {/* <Route path='/admin/explore' element={<AdminRoute><AdminExplore /></AdminRoute>} /> */}
            {/* <Route path='/admin/tourist-spots' element={<AdminRoute><AdminTouristSpots /></AdminRoute>} /> */}
            {/* <Route path='/admin/transport-hotels' element={<AdminRoute><AdminTransportHotels /></AdminRoute>} /> */}
            {/* <Route path='/admin/routes' element={<AdminRoute><AdminRoutes /></AdminRoute>} /> */}
            {/* <Route path='/admin/orders' element={<AdminRoute><AdminOrders /></AdminRoute>} /> */}

            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}
