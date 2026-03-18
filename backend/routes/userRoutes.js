const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Make sure this line exists

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working' });
});

// All routes below require authentication
router.use(auth);

// Become a driver
router.post('/become-driver', userController.becomeDriver);

// Upload documents - FIX THIS LINE
router.post('/documents', 
  upload.array('verificationDocuments', 5), 
  userController.uploadDocuments
);

// Other routes
router.get('/profile', userController.getMe);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);
router.get('/trips', userController.getUserTrips);

module.exports = router;