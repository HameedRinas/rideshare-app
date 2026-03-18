import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon,
  CurrencyDollarIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

const MyBookings = () => {
  // Removed dispatch and user since they're not used
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No bookings found</p>
          <Link
            to="/search"
            className="mt-4 inline-block btn-primary"
          >
            Find a Ride
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {booking.trip?.from} → {booking.trip?.to}
                    </h2>
                    <div className="flex items-center mt-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(new Date(booking.trip?.date), 'MMM dd, yyyy - h:mm a')}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">Driver: {booking.trip?.driverName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="text-sm">{booking.seats} seat(s)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-primary-600">
                      ${booking.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <Link
                    to={`/trips/${booking.trip?._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Trip Details →
                  </Link>
                  
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;