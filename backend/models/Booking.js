const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riderName: {
    type: String,
    required: true
  },
  riderEmail: {
    type: String,
    required: true
  },
  riderPhone: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_money'],
    default: 'cash'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Confirm booking
bookingSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.paymentStatus = 'paid';
  return this.save();
};

// Cancel booking
bookingSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Complete booking
bookingSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

// Find bookings by user
bookingSchema.statics.findByRider = function(riderId) {
  return this.find({ rider: riderId })
    .populate('trip')
    .sort({ createdAt: -1 });
};

// Find bookings by trip
bookingSchema.statics.findByTrip = function(tripId) {
  return this.find({ trip: tripId })
    .populate('rider')
    .sort({ createdAt: -1 });
};

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;