import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../store/slices/bookingSlice';
import { toast } from 'react-toastify';
import { CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const BookingForm = ({ trip, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [seats, setSeats] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const totalPrice = trip.price * seats;

  // Dummy card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon },
    { id: 'cash', name: 'Cash to Driver', icon: BanknotesIcon },
    { id: 'mobile', name: 'Mobile Money', icon: DevicePhoneMobileIcon },
  ];

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({
      ...cardDetails,
      cardNumber: formatted
    });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardDetails({
      ...cardDetails,
      expiryDate: value
    });
  };

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;
    
    // Simple validation for dummy payment
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.cardName) {
      toast.error('Please enter the cardholder name');
      return false;
    }
    if (cardDetails.expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const processDummyPayment = () => {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Always succeed for dummy payment
        resolve({
          success: true,
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          message: 'Payment processed successfully (DUMMY)'
        });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a ride');
      navigate('/login');
      return;
    }

    if (!validateCardDetails()) {
      return;
    }

    setLoading(true);
    
    try {
      // Process dummy payment
      const paymentResult = await processDummyPayment();
      console.log('Payment result:', paymentResult);
      
      // Create booking
      const bookingData = {
        tripId: trip._id,
        seats,
        specialRequests,
        paymentMethod,
        totalPrice,
        transactionId: paymentResult.transactionId
      };

      const result = await dispatch(createBooking(bookingData));
      
      if (createBooking.fulfilled.match(result)) {
        toast.success(`Booking confirmed! Transaction ID: ${paymentResult.transactionId}`);
        if (onClose) onClose();
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  if (!showPayment) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Ride</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Seats
            </label>
            <select
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {[...Array(trip.availableSeats)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'seat' : 'seats'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any special requirements?"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price per seat:</span>
              <span className="font-medium">${trip.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Number of seats:</span>
              <span className="font-medium">{seats}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary-600">${totalPrice}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 gap-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <method.icon className={`h-5 w-5 mr-3 ${
                  paymentMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={paymentMethod === method.id ? 'text-primary-700' : 'text-gray-700'}>
                  {method.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Card Details Form (only shown for card payment) */}
        {paymentMethod === 'card' && (
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Card Information (Dummy)</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Use any 16-digit number for testing</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  maxLength="3"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-xs text-blue-700">
                🔒 This is a dummy payment. No real transactions will be processed.
                Use any card number for testing.
              </p>
            </div>
          </div>
        )}

        {/* Cash payment info */}
        {paymentMethod === 'cash' && (
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-sm text-yellow-700">
              💵 You'll pay ${totalPrice} in cash to the driver when you meet.
            </p>
          </div>
        )}

        {/* Mobile money info */}
        {paymentMethod === 'mobile' && (
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-purple-700">
              📱 You'll receive payment instructions after booking confirmation.
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${totalPrice}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total to pay:</span>
            <span className="text-primary-600">${totalPrice}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowPayment(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${totalPrice}`}
          </button>
        </div>

        {/* Test card info */}
        {paymentMethod === 'card' && (
          <div className="text-xs text-gray-500 text-center mt-2">
            <p>Test with any 16-digit card number</p>
            <p className="font-mono">e.g., 4242 4242 4242 4242</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;