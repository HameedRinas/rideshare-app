import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { LockClosedIcon, KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const ResetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-reset-token/${token}`);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
        toast.error('Invalid or expired reset link');
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

const formik = useFormik({
  initialValues: {
    newPassword: '',
    confirmPassword: '',
  },
  validationSchema: ResetPasswordSchema,
  onSubmit: async (values) => {
    console.log('========== FRONTEND DEBUG ==========');
    console.log('1. Token from URL:', token);
    console.log('2. New password:', values.newPassword);
    console.log('3. Confirm password:', values.confirmPassword);
    
    setLoading(true);
    try {
      const requestData = {
        token: token,        // Make sure this is the token from URL params
        newPassword: values.newPassword
      };
      console.log('4. Sending to backend:', requestData);
      
      const response = await api.post('/auth/reset-password', requestData);
      console.log('5. Response:', response.data);
      
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      console.error('6. Error:', error);
      console.error('7. Error response:', error.response?.data);
      console.error('8. Error status:', error.response?.status);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  },
});

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <LockClosedIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <KeyIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className={`pl-10 w-full px-3 py-2 border rounded-md ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...formik.getFieldProps('newPassword')}
                />
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`pl-10 w-full px-3 py-2 border rounded-md ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...formik.getFieldProps('confirmPassword')}
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                🔒 Your new password must be at least 6 characters long.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;