const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/process/:bookingId', paymentController.processBookingPayment);
router.post('/refund/:bookingId', paymentController.processRefund);

module.exports = router;