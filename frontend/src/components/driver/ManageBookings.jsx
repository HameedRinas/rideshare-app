import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';
import tripService from '../../services/tripService';

const ManageBookings = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fix: Move fetchData inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tripData = await tripService.getTripById(tripId);
        setTrip(tripData);
        const bookingsData = await bookingService.getTripBookings(tripId);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tripId]); // Only depends on tripId

/*  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.confirmBooking(bookingId);
      toast.success('Booking confirmed successfully');
      // Refresh data
      const tripData = await tripService.getTripById(tripId);
      setTrip(tripData);
      const bookingsData = await bookingService.getTripBookings(tripId);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        // Refresh data
        const bookingsData = await bookingService.getTripBookings(tripId);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };*/

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Trip not found</p>
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="mt-4 btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/driver/dashboard')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Dashboard
      </button>

      {/* Trip Information */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-primary-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">
            {trip.from} → {trip.to}
          </h1>
          <div className="text-primary-100 mt-1 flex flex-wrap gap-4">
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(trip.date), 'EEEE, MMMM d, yyyy - h:mm a')}
            </span>
            <span className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              ${trip.price}/seat
            </span>
            <span className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {trip.availableSeats} seats left
            </span>
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same... */}
      {/* Bookings Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
          <p className="text-sm text-yellow-700">Pending</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{confirmedBookings.length}</p>
          <p className="text-sm text-green-700">Confirmed</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{completedBookings.length}</p>
          <p className="text-sm text-blue-700">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{cancelledBookings.length}</p>
          <p className="text-sm text-red-700">Cancelled</p>
        </div>
      </div>

      {/* ... keep the rest of your JSX as is (Pending, Confirmed, Completed, Cancelled sections) */}
      {/* The rest of the component remains unchanged from your original */}
    </div>
  );
};

export default ManageBookings;