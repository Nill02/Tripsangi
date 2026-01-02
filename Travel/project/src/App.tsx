import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';

/* ---------- USER PAGES ---------- */
import HomePage from './pages/User/HomePage';
import LocationPage from './pages/User/LocationPage';
import ExplorePage from './pages/User/ExplorePage';
import RoutePlanningPage from './pages/User/RoutePlanningPage';
import TransportPage from './pages/User/TransportPage';
import HotelsPage from './pages/User/HotelsPage';
import TouristPlacesPage from './pages/User/TouristPlacesPage';
import AIItineraryPage from './pages/User/AIItineraryPage';
import BudgetDashboardPage from './pages/User/BudgetDashboardPage';
import InsightsPage from './pages/User/InsightsPage';
import SafetyPage from './pages/User/SafetyPage';
import ProfilePage from './pages/User/ProfilePage';
import OrderPage from './pages/User/OrderPage';

/* ---------- AUTH PAGES ---------- */
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

/* ---------- ADMIN PAGES ---------- */
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminTouristSpots from './pages/admin/AdminTouristSpots';
import AdminTransport from './pages/admin/AdminTransport';
import AdminHotels from './pages/admin/AdminHotels';
import AdminExplore from './pages/admin/AdminExplore';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

/* ---------- CONTEXT & ROUTE GUARDS ---------- */
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            {/* ================= USER ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/explore/:locationId" element={<ExplorePage />} />
            <Route path="/route-planning" element={<RoutePlanningPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/tourist-places" element={<TouristPlacesPage />} />

            <Route
              path="/ai-itinerary"
              element={
                <PrivateRoute>
                  <AIItineraryPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <BudgetDashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/insights"
              element={
                <PrivateRoute>
                  <InsightsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/safety"
              element={
                <PrivateRoute>
                  <SafetyPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/order"
              element={
                <PrivateRoute>
                  <OrderPage />
                </PrivateRoute>
              }
            />

            {/* ================= AUTH ROUTES ================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/routes"
              element={
                <AdminRoute>
                  <AdminRoutes />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/tourist-spots"
              element={
                <AdminRoute>
                  <AdminTouristSpots />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/transport"
              element={
                <AdminRoute>
                  <AdminTransport />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/hotels"
              element={
                <AdminRoute>
                  <AdminHotels />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/explore"
              element={
                <AdminRoute>
                  <AdminExplore />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
          </Routes>

          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
