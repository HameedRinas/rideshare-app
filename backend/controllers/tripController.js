const { Trip, Booking } = require('../models');

const tripController = {
  // Create a new trip (drivers only)
  async createTrip(req, res, next) {
    try {
      const tripData = {
        ...req.body,
        driver: req.user._id,
        driverName: req.user.name,
        totalSeats: req.body.availableSeats,
        vehicleInfo: `${req.user.driverDetails.vehicleModel} - ${req.user.driverDetails.vehicleColor} (${req.user.driverDetails.vehiclePlateNumber})`
      };

      const trip = new Trip(tripData);
      await trip.save();

      res.status(201).json({
        message: 'Trip created successfully',
        trip
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all active trips
  async getActiveTrips(req, res, next) {
    try {
      const { from, to, date } = req.query;
      
      let trips;
      if (from || to) {
        trips = await Trip.findTripsByRoute(from, to, date);
      } else {
        trips = await Trip.findActiveTrips();
      }

      res.json(trips);
    } catch (error) {
      next(error);
    }
  },

  // Get trip by ID
  async getTripById(req, res, next) {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate('driver', 'name email phone rating')
        .populate('bookedBy', 'name');

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      res.json(trip);
    } catch (error) {
      next(error);
    }
  },

  // Update trip
  async updateTrip(req, res, next) {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      // Check if user is the driver
      if (trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You can only update your own trips' });
      }

      // Check if trip can be updated
      if (trip.status !== 'active') {
        return res.status(400).json({ error: 'Cannot update non-active trips' });
      }

      // Update allowed fields
      const updates = ['from', 'to', 'date', 'price', 'availableSeats', 'vehicleInfo'];
      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          trip[field] = req.body[field];
        }
      });

      await trip.save();

      res.json({
        message: 'Trip updated successfully',
        trip
      });
    } catch (error) {
      next(error);
    }
  },

  // Cancel trip
  async cancelTrip(req, res, next) {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      // Check if user is the driver
      if (trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You can only cancel your own trips' });
      }

      trip.status = 'cancelled';
      await trip.save();

      // Cancel all bookings for this trip
      await Booking.updateMany(
        { trip: trip._id, status: { $in: ['pending', 'confirmed'] } },
        { status: 'cancelled' }
      );

      res.json({
        message: 'Trip cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get driver's trips
  async getMyTrips(req, res, next) {
    try {
      const trips = await Trip.find({ driver: req.user._id })
        .sort({ date: -1 });

      res.json(trips);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tripController;