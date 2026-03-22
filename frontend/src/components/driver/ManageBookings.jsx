import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';
import tripService from '../../services/tripService';

const ManageBookings = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch trip details
      const tripData = await tripService.getTripById(tripId);
      setTrip(tripData);
      
      // Fetch bookings for this trip
      const bookingsData = await bookingService.getTripBookings(tripId);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.confirmBooking(bookingId);
      toast.success('Booking confirmed successfully');
      fetchData(); // Refresh data
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
        fetchData(); // Refresh data
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
  };

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

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{booking.riderName}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {booking.riderEmail}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {booking.riderPhone}
                      </div>
                      <div>
                        <span className="font-medium">Seats:</span> {booking.seats}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ${booking.totalPrice}
                      </div>
                    </div>
                    {booking.specialRequests && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <span className="font-medium text-sm">Special Requests:</span>
                        <p className="text-sm text-gray-600 mt-1">{booking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmBooking(booking._id)}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Bookings */}
      {confirmedBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Confirmed Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {confirmedBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.riderName}</h3>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {booking.riderEmail}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {booking.riderPhone}
                      </div>
                      <div>
                        <span className="font-medium">Seats:</span> {booking.seats}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ${booking.totalPrice}
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Bookings */}
      {completedBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Completed Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.riderName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.seats} seat(s) - ${booking.totalPrice}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cancelled Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {cancelledBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.riderName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.seats} seat(s) - ${booking.totalPrice}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No bookings yet for this trip</p>
          <Link
            to="/create-trip"
            className="mt-4 inline-block btn-primary"
          >
            Offer Another Ride
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;