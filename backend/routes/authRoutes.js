const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, userValidationRules } = require('../middleware/validation');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);

// Forgot password routes (public)
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

module.exports = router;