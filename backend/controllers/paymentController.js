const { Booking } = require('../models');

// Mock payment service (replace with actual payment gateway like Stripe)
class PaymentService {
  async processPayment(amount, method, details) {
    // Simulate payment processing
    console.log(`Processing payment of $${amount} via ${method}`);
    
    return {
      success: true,
      transactionId: `TXN_${Date.now()}`,
      message: 'Payment processed successfully'
    };
  }
}

const paymentService = new PaymentService();

const paymentController = {
  async processBookingPayment(req, res, next) {
    try {
      const { bookingId } = req.params;
      const { paymentMethod, paymentDetails } = req.body;

      const booking = await Booking.findById(bookingId).populate('trip');
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Process payment
      const paymentResult = await paymentService.processPayment(
        booking.totalPrice,
        paymentMethod,
        paymentDetails
      );

      if (paymentResult.success) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation email
        const emailService = require('../services/emailService');
        await emailService.sendBookingConfirmation(booking, req.user, booking.trip);

        res.json({
          message: 'Payment successful',
          booking,
          transactionId: paymentResult.transactionId
        });
      } else {
        res.status(400).json({ error: 'Payment failed' });
      }
    } catch (error) {
      next(error);
    }
  },

  async processRefund(req, res, next) {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.paymentStatus !== 'paid') {
        return res.status(400).json({ error: 'Booking not paid' });
      }

      // Process refund logic here
      booking.paymentStatus = 'refunded';
      await booking.save();

      res.json({
        message: 'Refund processed successfully',
        booking
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;