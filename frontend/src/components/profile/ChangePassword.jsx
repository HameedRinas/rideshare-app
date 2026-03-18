import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  KeyIcon,
  LockClosedIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.put('/users/password', {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        });
        
        toast.success('Password changed successfully!');
        
        // Clear form
        formik.resetForm();
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } catch (error) {
        console.error('Password change error:', error);
        toast.error(error.response?.data?.error || 'Failed to change password');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/profile')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Profile
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <KeyIcon className="h-10 w-10 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                name="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                  formik.touched.currentPassword && formik.errors.currentPassword
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Enter current password"
              />
            </div>
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <KeyIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Enter new password"
              />
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Password requirements note */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              🔒 Password must be at least 6 characters long. Use a combination of letters, numbers, and symbols for better security.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;