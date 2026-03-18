const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  universityEmail: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values while maintaining uniqueness
    required: function() {
      return this.userType === 'student'; // Only required for students
    },
    validate: {
      validator: function(v) {
        // Only validate if user is student and value exists
        if (this.userType === 'student' && v) {
          return /\.ac\.lk$/.test(v) || /\.edu$/.test(v);
        }
        return true;
      },
      message: 'University email must be from a valid academic domain'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  university: {
    type: String,
    required: function() {
      return this.userType === 'student'; // Only required for students
    }
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['driver', 'rider', 'both'],
    default: 'rider'
  },
  userType: {
    type: String,
    enum: ['student', 'driver'],
    default: 'student'
  },
  isStudent: {
    type: Boolean,
    default: false
  },
  driverDetails: {
  licenseNumber: {
    type: String,
    sparse: true
  },
  licenseExpiry: Date,
  vehicleType: {
    type: String,
    enum: ['car', 'motorcycle', 'van', 'tuk-tuk', 'other'],
    default: 'car'
  },
  vehicleModel: String,
  vehicleColor: String,
  vehiclePlateNumber: {
    type: String,
    sparse: true
  },
  availableSeats: {
    type: Number,
    min: 1,
    max: 10,
    default: 4
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  preferences: {
    type: {
      smoking: { type: Boolean, default: false },
      music: { type: Boolean, default: true },
      pets: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: true }
    },
    default: {
      smoking: false,
      music: true,
      pets: false,
      airConditioning: true
    }
  }
},
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  emergencyContact: {
    name: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get user info without sensitive data
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpiry;
  delete userObject.__v;
  
  return {
    _id: userObject._id,
    name: userObject.name || '',
    email: userObject.email || '',
    universityEmail: userObject.universityEmail || '',
    phone: userObject.phone || '',
    university: userObject.university || '',
    role: userObject.role || 'rider',
    userType: userObject.userType || 'student',
    isStudent: userObject.isStudent || false,
    rating: userObject.rating || 0,
    totalTrips: userObject.totalTrips || 0,
    createdAt: userObject.createdAt,
    driverDetails: userObject.driverDetails || {
      isVerified: false,
      licenseNumber: null,
      vehicleModel: null,
      vehicleColor: null,
      vehiclePlateNumber: null
    },
    isVerified: userObject.isVerified || false
  };
};

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;