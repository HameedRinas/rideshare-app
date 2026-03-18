import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  DocumentTextIcon,
  IdentificationIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'; // Removed ArrowDownTrayIcon
import api from '../services/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [verifiedDrivers, setVerifiedDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalTrips: 0,
    totalBookings: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending drivers
      const pendingResponse = await api.get('/admin/verifications/pending');
      console.log('Pending drivers:', pendingResponse.data);
      setPendingDrivers(pendingResponse.data);
      
      // Fetch verified drivers
      const verifiedResponse = await api.get('/admin/drivers/verified');
      setVerifiedDrivers(verifiedResponse.data);
      
      // Fetch stats
      const statsResponse = await api.get('/admin/dashboard/stats');
      setStats(statsResponse.data);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDriver = async (userId, approve = true) => {
    try {
      await api.put(`/admin/drivers/${userId}/verify`, {
        verified: approve
      });
      
      if (approve) {
        toast.success('Driver verified successfully');
      } else {
        toast.info('Driver verification rejected');
      }
      
      // Refresh data
      fetchDashboardData();
      setShowDetails(false);
      setSelectedDriver(null);
    } catch (error) {
      console.error('Error verifying driver:', error);
      toast.error(error.response?.data?.error || 'Failed to process request');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchDashboardData();
        setShowDetails(false);
        setSelectedDriver(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const getDocumentIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <PhotoIcon className="h-5 w-5 text-blue-500" />;
    } else if (ext === 'pdf') {
      return <DocumentTextIcon className="h-5 w-5 text-red-500" />;
    } else {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const DriverDetailsModal = ({ driver, onClose, onVerify, onReject, onDelete }) => {
    if (!driver) return null;

    const documents = driver.driverDetails?.verificationDocuments || [];
    console.log('Driver documents:', documents);

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Driver Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h4>
              <div className="space-y-2">
                <p><span className="text-sm text-gray-500">Name:</span> <span className="font-medium">{driver.name}</span></p>
                <p><span className="text-sm text-gray-500">Email:</span> {driver.email}</p>
                <p><span className="text-sm text-gray-500">University:</span> {driver.university || 'N/A'}</p>
                <p><span className="text-sm text-gray-500">Phone:</span> {driver.phone}</p>
                <p><span className="text-sm text-gray-500">Member since:</span> {new Date(driver.createdAt).toLocaleDateString()}</p>
                <p><span className="text-sm text-gray-500">User Type:</span> {driver.userType || 'student'}</p>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <IdentificationIcon className="h-5 w-5 mr-2 text-primary-600" />
                License Information
              </h4>
              <div className="space-y-2">
                <p><span className="text-sm text-gray-500">License Number:</span> <span className="font-medium">{driver.driverDetails?.licenseNumber || 'N/A'}</span></p>
                <p><span className="text-sm text-gray-500">Expiry Date:</span> {driver.driverDetails?.licenseExpiry ? new Date(driver.driverDetails.licenseExpiry).toLocaleDateString() : 'N/A'}</p>
                <p><span className="text-sm text-gray-500">Status:</span> {
                  driver.driverDetails?.isVerified ? (
                    <span className="text-green-600 font-medium">Verified</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )
                }</p>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-primary-600" />
                Vehicle Information
              </h4>
              <div className="space-y-2">
                <p><span className="text-sm text-gray-500">Type:</span> {driver.driverDetails?.vehicleType || 'N/A'}</p>
                <p><span className="text-sm text-gray-500">Model:</span> {driver.driverDetails?.vehicleModel || 'N/A'}</p>
                <p><span className="text-sm text-gray-500">Color:</span> {driver.driverDetails?.vehicleColor || 'N/A'}</p>
                <p><span className="text-sm text-gray-500">License Plate:</span> {driver.driverDetails?.vehiclePlateNumber || 'N/A'}</p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
                Verification Documents ({documents.length})
              </h4>
              
              {documents.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {documents.map((doc, index) => {
                    // Extract just the filename from the path
                    const filename = doc.split('\\').pop().split('/').pop();
                    const fileUrl = `http://localhost:5000/${doc.replace(/\\/g, '/')}`;
                    
                    return (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                        <div className="flex items-center space-x-2">
                          {getDocumentIcon(filename)}
                          <span className="text-sm text-gray-700 truncate max-w-[150px]">
                            {filename}
                          </span>
                        </div>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 text-xs"
                        >
                          <EyeIcon className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            {!driver.driverDetails?.isVerified && (
              <>
                <button
                  onClick={() => onVerify(driver._id)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve Driver
                </button>
                <button
                  onClick={() => onReject(driver._id)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject Application
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(driver._id)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              Delete User
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DriverCard = ({ driver, isPending = false }) => {
    const documentCount = driver.driverDetails?.verificationDocuments?.length || 0;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-100 rounded-full p-3">
              <UserGroupIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
              <p className="text-sm text-gray-500">{driver.email}</p>
              <p className="text-sm text-gray-500">{driver.university || 'No university'}</p>
              
              <div className="mt-3 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Vehicle:</span> {driver.driverDetails?.vehicleColor || 'N/A'} {driver.driverDetails?.vehicleModel || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Plate:</span> {driver.driverDetails?.vehiclePlateNumber || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Applied:</span> {new Date(driver.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Documents:</span> 
                  <span className={`ml-1 ${documentCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {documentCount} uploaded
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {isPending ? (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                <ClockIcon className="h-4 w-4 mr-1" />
                Pending
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Verified
              </span>
            )}
            
            <button
              onClick={() => {
                setSelectedDriver(driver);
                setShowDetails(true);
              }}
              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
        </div>
      </div>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={UserGroupIcon} label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={TruckIcon} label="Total Drivers" value={stats.totalDrivers} color="green" />
        <StatCard icon={ClockIcon} label="Pending Verifications" value={pendingDrivers.length} color="yellow" />
        <StatCard icon={ShieldCheckIcon} label="Verified Drivers" value={verifiedDrivers.length} color="purple" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Verifications ({pendingDrivers.length})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`${
              activeTab === 'verified'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Verified Drivers ({verifiedDrivers.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeTab === 'pending' && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Driver Verifications</h2>
            {pendingDrivers.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No pending verifications</p>
                <p className="text-gray-400 text-sm">New driver applications will appear here</p>
              </div>
            ) : (
              pendingDrivers.map(driver => (
                <DriverCard key={driver._id} driver={driver} isPending={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'verified' && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verified Drivers</h2>
            {verifiedDrivers.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No verified drivers yet</p>
                <p className="text-gray-400 text-sm">Verified drivers will appear here</p>
              </div>
            ) : (
              verifiedDrivers.map(driver => (
                <DriverCard key={driver._id} driver={driver} isPending={false} />
              ))
            )}
          </>
        )}
      </div>

      {/* Driver Details Modal */}
      {showDetails && selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          onClose={() => {
            setShowDetails(false);
            setSelectedDriver(null);
          }}
          onVerify={(id) => handleVerifyDriver(id, true)}
          onReject={(id) => handleVerifyDriver(id, false)}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default AdminPage;