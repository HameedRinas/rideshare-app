const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  vehicleInfo: {
    type: String,
    required: true
  },
  bookedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'full'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update available seats when booking is made
tripSchema.methods.bookSeats = function(seatsCount) {
  if (this.availableSeats < seatsCount) {
    throw new Error('Not enough seats available');
  }
  this.availableSeats -= seatsCount;
  if (this.availableSeats === 0) {
    this.status = 'full';
  }
  return this.save();
};

// Cancel booking and free up seats
tripSchema.methods.cancelBooking = function(seatsCount) {
  this.availableSeats += seatsCount;
  if (this.status === 'full' && this.availableSeats > 0) {
    this.status = 'active';
  }
  return this.save();
};

// Find active trips
tripSchema.statics.findActiveTrips = function() {
  return this.find({ 
    status: 'active',
    date: { $gte: new Date() }
  }).sort({ date: 1 });
};

// Find trips by location
tripSchema.statics.findTripsByRoute = function(from, to, date) {
  const query = { 
    status: 'active',
    from: new RegExp(from, 'i'),
    to: new RegExp(to, 'i')
  };
  
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query).sort({ date: 1 });
};

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;