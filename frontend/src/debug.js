// Run this in browser console to debug

console.log('Checking components:');

// Check if components are properly exported
const components = {
  HomePage: require('./pages/HomePage'),
  Login: require('./components/auth/Login'),
  Register: require('./components/auth/Register'),
  TripSearch: require('./components/trips/TripSearch'),
  TripDetails: require('./components/trips/TripDetails'),
  CreateTrip: require('./components/trips/CreateTrip'),
  MyTrips: require('./components/trips/MyTrips'),
  MyBookings: require('./components/bookings/MyBookings'),
  UserProfile: require('./components/profile/UserProfile'),
  DriverVerification: require('./components/driver/DriverVerification'),
  Navbar: require('./components/common/Navbar'),
  PrivateRoute: require('./components/common/PrivateRoute'),
  ErrorBoundary: require('./components/common/ErrorBoundary'),
};

Object.entries(components).forEach(([name, component]) => {
  console.log(`${name}:`, component.default ? '✓ Default export' : '✗ No default export');
  if (!component.default) {
    console.log('  Available exports:', Object.keys(component));
  }
});