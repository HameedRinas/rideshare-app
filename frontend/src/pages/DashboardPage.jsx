import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  CalendarIcon,
  TruckIcon,
  StarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // If not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const stats = [
    {
      name: 'Total Trips',
      value: user.totalTrips || 0,
      icon: TruckIcon,
    },
    {
      name: 'Rating',
      value: user.rating?.toFixed(1) || '0.0',
      icon: StarIcon,
    },
    {
      name: 'Member Since',
      value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      icon: UserGroupIcon,
    }
  ];

  const quickActions = [
    {
      name: 'Find a Ride',
      description: 'Search for available rides',
      href: '/search',
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'My Bookings',
      description: 'View your bookings',
      href: '/my-bookings',
      icon: BookOpenIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'My Profile',
      description: 'View and edit profile',
      href: '/profile',
      icon: UserGroupIcon,
      color: 'bg-orange-500'
    }
  ];

  // Add driver-specific actions if user is a driver
  if (user.role === 'driver' || user.role === 'both') {
    if (user.driverDetails?.isVerified) {
      quickActions.unshift({
        name: 'Offer a Ride',
        description: 'Create a new trip',
        href: '/create-trip',
        icon: TruckIcon,
        color: 'bg-green-500'
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your rides today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Verification Warning */}
      {(user.role === 'driver' || user.role === 'both') && !user.driverDetails?.isVerified && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your driver verification is pending. You'll be able to offer rides once verified.
                <Link to="/driver/verify" className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600">
                  Check Status
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-sm text-gray-500 truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4">
              <p className="text-gray-500 text-center">No recent activity</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;