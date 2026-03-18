const express = require('express');
const router = express.Router();

// Try to load each route file individually with error handling
let authRoutes, userRoutes, tripRoutes, bookingRoutes, adminRoutes;

try {
  authRoutes = require('./authRoutes');
  console.log('✓ authRoutes loaded');
} catch (error) {
  console.error('✗ Failed to load authRoutes:', error.message);
}

try {
  userRoutes = require('./userRoutes');
  console.log('✓ userRoutes loaded');
} catch (error) {
  console.error('✗ Failed to load userRoutes:', error.message);
}

try {
  tripRoutes = require('./tripRoutes');
  console.log('✓ tripRoutes loaded');
} catch (error) {
  console.error('✗ Failed to load tripRoutes:', error.message);
}

try {
  bookingRoutes = require('./bookingRoutes');
  console.log('✓ bookingRoutes loaded');
} catch (error) {
  console.error('✗ Failed to load bookingRoutes:', error.message);
}

try {
  adminRoutes = require('./adminRoutes');
  console.log('✓ adminRoutes loaded');
} catch (error) {
  console.error('✗ Failed to load adminRoutes:', error.message);
}

// Only use routes that loaded successfully
if (authRoutes) router.use('/auth', authRoutes);
if (userRoutes) router.use('/users', userRoutes);
if (tripRoutes) router.use('/trips', tripRoutes);
if (bookingRoutes) router.use('/bookings', bookingRoutes);
if (adminRoutes) router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

module.exports = router;