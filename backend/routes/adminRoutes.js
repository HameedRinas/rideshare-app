const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { roleAuth } = require('../middleware/roleAuth');

// All admin routes require authentication and admin role
router.use(auth);
router.use(roleAuth('admin'));

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Driver verifications
router.get('/verifications/pending', adminController.getPendingVerifications);
router.get('/drivers/verified', adminController.getVerifiedDrivers);
router.put('/drivers/:userId/verify', adminController.verifyDriver);

// User management
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;