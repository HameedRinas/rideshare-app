import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  // MapPinIcon removed
  UserGroupIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import tripService from '../../services/tripService';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = async (tripId) => {
    try {
      const data = await bookingService.getTripBookings(tripId);
      setBookings(data);
      setSelectedTrip(tripId);
      setShowBookings(true);
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const handleCancelTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip? This will affect all bookings.')) {
      try {
        await tripService.cancelTrip(tripId);
        toast.success('Trip cancelled successfully');
        fetchMyTrips();
      } catch (error) {
        toast.error('Failed to cancel trip');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      full: 'bg-yellow-100 text-yellow-800',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Offered Trips</h1>
        <Link
          to="/create-trip"
          className="btn-primary"
        >
          Offer New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You haven't created any trips yet</p>
          <Link
            to="/create-trip"
            className="mt-4 inline-block btn-primary"
          >
            Offer Your First Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {trip.from} → {trip.to}
                    </h2>
                    <div className="flex items-center mt-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(new Date(trip.date), 'MMM dd, yyyy - h:mm a')}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(trip.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <UserGroupIcon className="h-4 w-4" />
                    <span className="text-sm">{trip.availableSeats}/{trip.totalSeats} seats</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span className="text-sm">${trip.price}/seat</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">{trip.bookedBy?.length || 0} booking(s)</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleViewBookings(trip._id)}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Bookings
                    </button>
                    {trip.status === 'active' && (
                      <>
                        <Link
                          to={`/trips/${trip._id}/edit`}
                          className="inline-flex items-center text-gray-600 hover:text-gray-700 ml-4"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleCancelTrip(trip._id)}
                          className="inline-flex items-center text-red-600 hover:text-red-700 ml-4"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Cancel Trip
                        </button>
                      </>
                    )}
                  </div>
                  <Link
                    to={`/trips/${trip._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>

                {/* Bookings Modal */}
                {showBookings && selectedTrip === trip._id && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Trip Bookings</h3>
                        <button
                          onClick={() => setShowBookings(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-3">
                        {bookings.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No bookings yet</p>
                        ) : (
                          bookings.map((booking) => (
                            <div key={booking._id} className="border rounded-md p-3">
                              <p className="font-medium">{booking.riderName}</p>
                              <p className="text-sm text-gray-600">{booking.seats} seat(s)</p>
                              <p className="text-sm text-gray-600">Status: {booking.status}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;