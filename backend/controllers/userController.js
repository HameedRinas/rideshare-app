const { User } = require('../models');

const userController = {
  // Get current user
  getMe: (req, res) => {
    res.json(req.user.getPublicProfile());
  },

  // Update profile - ADD THIS FUNCTION
  updateProfile: async (req, res, next) => {
    try {
      console.log('Updating profile for user:', req.user._id);
      console.log('Update data:', req.body);

      const updates = ['name', 'phone', 'university', 'emergencyContact'];
      const updateData = {};

      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -verificationToken');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Profile updated successfully:', user);

      res.json({
        message: 'Profile updated successfully',
        user: user.getPublicProfile()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      next(error);
    }
  },

  // Update password
  updatePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      next(error);
    }
  },

  // Become a driver
 becomeDriver: async (req, res, next) => {
  try {
    console.log('=== BECOME DRIVER BACKEND ===');
    console.log('Request body:', req.body);
    console.log('User from auth:', req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Current user role:', user.role);
    console.log('Current driver details:', user.driverDetails);

    // Update role if needed
    if (user.role === 'rider') {
      user.role = 'both';
    }

    // Preserve existing preferences or set defaults
    const existingPreferences = user.driverDetails?.preferences || {
      smoking: false,
      music: true,
      pets: false,
      airConditioning: true
    };

    // Update driver details - preserve existing fields
    user.driverDetails = {
      ...user.driverDetails, // Keep all existing fields
      licenseNumber: req.body.licenseNumber,
      licenseExpiry: req.body.licenseExpiry,
      vehicleType: req.body.vehicleType || 'car',
      vehicleModel: req.body.vehicleModel,
      vehicleColor: req.body.vehicleColor,
      vehiclePlateNumber: req.body.vehiclePlateNumber,
      preferences: existingPreferences, // Ensure preferences is set
      isVerified: false
    };

    console.log('Updated driver details:', user.driverDetails);

    await user.save();
    console.log('User saved successfully');

    res.json({
      message: 'Driver application submitted successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Become driver error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    next(error);
  }
},
    
// Upload documents
// Upload documents
uploadDocuments: async (req, res, next) => {
  try {
    console.log('=== UPLOAD DOCUMENTS ===');
    console.log('Files received:', req.files);
    console.log('User ID:', req.user._id);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.email);
    console.log('Current driverDetails:', user.driverDetails);
    
    // Create file paths for database (use forward slashes for consistency)
    const filePaths = req.files.map(file => file.path.replace(/\\/g, '/'));
    console.log('File paths to save:', filePaths);
    
    // Initialize driverDetails if it doesn't exist
    if (!user.driverDetails) {
      user.driverDetails = {};
    }
    
    // Initialize verificationDocuments array if it doesn't exist
    if (!user.driverDetails.verificationDocuments) {
      user.driverDetails.verificationDocuments = [];
    }
    
    // Add new file paths
    user.driverDetails.verificationDocuments.push(...filePaths);
    console.log('Updated verificationDocuments:', user.driverDetails.verificationDocuments);
    
    await user.save();
    console.log('User saved successfully with documents');

    res.json({
      message: 'Documents uploaded successfully',
      documents: filePaths
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    next(error);
  }
},
  // Get user trips
  getUserTrips: async (req, res, next) => {
    try {
      const { Trip, Booking } = require('../models');
      
      const trips = await Trip.find({ driver: req.user._id }).sort({ date: -1 });
      const bookings = await Booking.find({ rider: req.user._id })
        .populate('trip')
        .sort({ createdAt: -1 });

      res.json({
        asDriver: trips,
        asRider: bookings
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;