import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon
  // Removed CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const TripCard = ({ trip }) => {
  return (
    <Link to={`/trips/${trip._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-100 rounded-full p-2">
                <UserGroupIcon className="h-5 w-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {trip.availableSeats} seats left
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Available
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium text-gray-900">{trip.from}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium text-gray-900">{trip.to}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(trip.date), 'MMM dd, yyyy - h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Driver</p>
                <p className="font-medium text-gray-900">{trip.driverName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Price per seat</p>
                <p className="text-xl font-bold text-primary-600">
                  ${trip.price}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;