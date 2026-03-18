const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const { isDriver } = require('../middleware/roleAuth');

// Public routes
router.get('/search', tripController.getActiveTrips);
router.get('/:id', tripController.getTripById);

// Protected routes
router.use(auth);
router.get('/driver/my-trips', tripController.getMyTrips);
router.post('/', isDriver, tripController.createTrip);
router.put('/:id', isDriver, tripController.updateTrip);
router.delete('/:id/cancel', isDriver, tripController.cancelTrip);

module.exports = router;