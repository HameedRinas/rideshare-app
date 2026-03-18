const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const { isDriver } = require('../middleware/roleAuth');

// All booking routes require authentication
router.use(auth);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/confirm', isDriver, bookingController.confirmBooking);
router.put('/:id/complete', isDriver, bookingController.completeBooking);
router.get('/trip/:tripId', isDriver, bookingController.getTripBookings);

module.exports = router;