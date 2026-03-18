import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  StarIcon,
  ShieldCheckIcon,
  PencilIcon,
  KeyIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Debug logs
  useEffect(() => {
    console.log('UserProfile - auth state:', { user, isAuthenticated, loading });
    console.log('UserProfile - localStorage user:', localStorage.getItem('user'));
  }, [user, isAuthenticated, loading]);

  // Handle navigation
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show message if no user data
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <UserCircleIcon className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to load user profile</h2>
          <p className="text-gray-600 mb-6">There was an error loading your profile information.</p>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMMM yyyy') : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-primary-600" />
        <div className="ml-3">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2">
              <UserCircleIcon className="h-16 w-16 text-primary-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">{user.name || 'User'}</h1>
              <p className="text-primary-100">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-end space-x-3">
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
          <Link
            to="/change-password"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <KeyIcon className="h-4 w-4 mr-2" />
            Change Password
          </Link>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">University Email</p>
                  <p className="text-gray-900">{user.universityEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{user.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="text-gray-900">{user.university || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={StarIcon}
                label="Rating"
                value={user.rating?.toFixed(1) || '0.0'}
              />
              <StatCard
                icon={ShieldCheckIcon}
                label="Total Trips"
                value={user.totalTrips || 0}
              />
              <StatCard
                icon={UserCircleIcon}
                label="Role"
                value={user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Rider'}
              />
            </div>
          </div>

          {/* Driver Details (if applicable) */}
          {(user.role === 'driver' || user.role === 'both') && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <p className="text-gray-900">
                      {user.driverDetails?.isVerified ? (
                        <span className="text-green-600 font-medium">Verified</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending Verification</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="text-gray-900">{user.driverDetails?.licenseNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="text-gray-900">
                      {user.driverDetails?.vehicleColor || ''} {user.driverDetails?.vehicleModel || ''}
                      {(user.driverDetails?.vehicleColor || user.driverDetails?.vehicleModel) ? '' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="text-gray-900">{user.driverDetails?.vehiclePlateNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;