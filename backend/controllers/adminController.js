const { User, Trip, Booking } = require('../models');

const adminController = {
  // Get dashboard stats
  async getDashboardStats(req, res, next) {
    try {
      const stats = {
        totalUsers: await User.countDocuments(),
        totalDrivers: await User.countDocuments({ 
          role: { $in: ['driver', 'both'] } 
        }),
        totalTrips: await Trip.countDocuments(),
        totalBookings: await Booking.countDocuments()
      };

      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  // Get pending driver verifications
  async getPendingVerifications(req, res, next) {
    try {
      const pendingDrivers = await User.find({
        role: { $in: ['driver', 'both'] },
        'driverDetails.isVerified': false
      }).select('-password -verificationToken');

      res.json(pendingDrivers);
    } catch (error) {
      next(error);
    }
  },

  // Get verified drivers
  async getVerifiedDrivers(req, res, next) {
    try {
      const verifiedDrivers = await User.find({
        role: { $in: ['driver', 'both'] },
        'driverDetails.isVerified': true
      }).select('-password -verificationToken');

      res.json(verifiedDrivers);
    } catch (error) {
      next(error);
    }
  },

  // Verify or reject driver
  async verifyDriver(req, res, next) {
    try {
      const { userId } = req.params;
      const { verified } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.driverDetails.isVerified = verified;
      await user.save();

      res.json({
        message: `Driver ${verified ? 'verified' : 'rejected'} successfully`,
        user: user.getPublicProfile()
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete user
  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      // Don't allow deleting yourself
      if (userId === req.user._id.toString()) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete related data
      await Trip.deleteMany({ driver: userId });
      await Booking.deleteMany({ rider: userId });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;