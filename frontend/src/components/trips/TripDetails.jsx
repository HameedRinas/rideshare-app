import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Changed: removed useDispatch
import { format } from 'date-fns';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import tripService from '../../services/tripService';
import BookingForm from '../bookings/BookingForm';
import { toast } from 'react-toastify';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Keep only useSelector
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (error) {
      toast.error('Failed to load trip details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

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
        <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
        <button
          onClick={() => navigate('/search')}
          className="mt-4 btn-primary"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trip Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">
                {trip.from} → {trip.to}
              </h1>
              <p className="text-primary-100 mt-1">
                {format(new Date(trip.date), 'EEEE, MMMM d, yyyy')} at{' '}
                {format(new Date(trip.date), 'h:mm a')}
              </p>
            </div>

            {/* Trip Info */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-medium text-gray-900">{trip.from}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium text-gray-900">{trip.to}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">Approx. 2 hours 30 mins</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Available Seats</p>
                      <p className="font-medium text-gray-900">
                        {trip.availableSeats} of {trip.totalSeats} seats
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Price per seat</p>
                      <p className="font-medium text-gray-900">${trip.price}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{trip.vehicleInfo}</p>
                </div>
              </div>

              {/* Driver Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 rounded-full p-3">
                    <UserIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-medium text-gray-900">{trip.driver?.name}</h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(trip.driver?.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({trip.driver?.rating?.toFixed(1) || '0'})
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span className="text-sm">{trip.driver?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span className="text-sm">{trip.driver?.email}</span>
                      </div>
                    </div>
                    {trip.driver?.driverDetails?.isVerified && (
                      <div className="mt-2 flex items-center space-x-1 text-green-600">
                        <ShieldCheckIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified Driver</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          {user ? (
            user._id === trip.driver?._id ? (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-600">This is your trip</p>
                <button
                  onClick={() => navigate(`/my-trips`)}
                  className="mt-4 btn-primary w-full"
                >
                  Manage Trip
                </button>
              </div>
            ) : trip.availableSeats > 0 ? (
              showBookingForm ? (
                <BookingForm trip={trip} onClose={() => setShowBookingForm(false)} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Ride</h3>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full btn-primary"
                  >
                    Book Now
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <p className="text-red-600 font-medium">No seats available</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-600 mb-4">Please login to book this ride</p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;