const { Booking, Trip, User } = require('../models');

const bookingController = {
  // Create a new booking
  async createBooking(req, res, next) {
    try {
      const { tripId, seats, paymentMethod, specialRequests } = req.body;

      // Find trip
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      // Check availability
      if (trip.availableSeats < seats) {
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      // Check if user already booked this trip
      const existingBooking = await Booking.findOne({
        trip: tripId,
        rider: req.user._id,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingBooking) {
        return res.status(400).json({ error: 'You already have a booking for this trip' });
      }

      // Calculate total price
      const totalPrice = trip.price * seats;

      // Create booking
      const booking = new Booking({
        trip: tripId,
        rider: req.user._id,
        riderName: req.user.name,
        riderEmail: req.user.email,
        riderPhone: req.user.phone,
        seats,
        totalPrice,
        paymentMethod,
        specialRequests,
        status: 'pending'
      });

      await booking.save();

      // Update trip availability
      await trip.bookSeats(seats);

      res.status(201).json({
        message: 'Booking created successfully',
        booking
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user's bookings
  async getMyBookings(req, res, next) {
    try {
      const bookings = await Booking.findByRider(req.user._id);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  },

  // Get booking by ID
  async getBookingById(req, res, next) {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('trip')
        .populate('rider', 'name email phone');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if user is authorized
      if (booking.rider._id.toString() !== req.user._id.toString() && 
          booking.trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(booking);
    } catch (error) {
      next(error);
    }
  },

  // Cancel booking
  async cancelBooking(req, res, next) {
    try {
      const booking = await Booking.findById(req.params.id).populate('trip');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if user is the rider
      if (booking.rider.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You can only cancel your own bookings' });
      }

      // Check if booking can be cancelled
      if (booking.status === 'cancelled' || booking.status === 'completed') {
        return res.status(400).json({ error: 'Booking cannot be cancelled' });
      }

      // Update booking status
      await booking.cancel();

      // Free up seats on the trip
      const trip = await Trip.findById(booking.trip._id);
      await trip.cancelBooking(booking.seats);

      res.json({
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Confirm booking (driver action)
  async confirmBooking(req, res, next) {
    try {
      const booking = await Booking.findById(req.params.id).populate('trip');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if user is the driver of the trip
      if (booking.trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Only the driver can confirm bookings' });
      }

      await booking.confirm();

      res.json({
        message: 'Booking confirmed successfully',
        booking
      });
    } catch (error) {
      next(error);
    }
  },

  // Complete booking
  async completeBooking(req, res, next) {
    try {
      const booking = await Booking.findById(req.params.id).populate('trip');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if user is the driver
      if (booking.trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Only the driver can complete bookings' });
      }

      await booking.complete();

      // Update rider stats
      await User.findByIdAndUpdate(booking.rider, {
        $inc: { totalTrips: 1 }
      });

      res.json({
        message: 'Trip completed successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get trip bookings (for drivers)
  async getTripBookings(req, res, next) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      // Check if user is the driver
      if (trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const bookings = await Booking.findByTrip(tripId);

      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookingController;