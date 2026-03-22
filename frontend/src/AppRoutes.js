import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages and Components
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TripSearch from './components/trips/TripSearch';
import TripDetails from './components/trips/TripDetails';
import CreateTrip from './components/trips/CreateTrip';
import MyTrips from './components/trips/MyTrips';
import MyBookings from './components/bookings/MyBookings';
import UserProfile from './components/profile/UserProfile';
import EditProfile from './components/profile/EditProfile';
import ChangePassword from './components/profile/ChangePassword';
import DriverVerification from './components/driver/DriverVerification';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword'; // ✅ ADD THIS IMPORT
import ManageBookings from './components/driver/ManageBookings';

// Public route - redirects to profile if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Public routes that don't need redirect */}
      <Route path="/search" element={<TripSearch />} />
      <Route path="/trips/:id" element={<TripDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ ADD THIS ROUTE */}

      {/* Protected Routes - for authenticated users */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/driver/verify" element={<DriverVerification />} />
         <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/trip/:tripId/bookings" element={<ManageBookings />} />
      </Route>

      {/* Admin Routes - only for admin users */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;