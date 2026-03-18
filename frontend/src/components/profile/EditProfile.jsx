import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Removed useDispatch
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
// Removed login import since it's not used

const EditProfileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
    .required('Phone number is required'),
  university: Yup.string().required('University is required'),
  emergencyContact: Yup.object({
    name: Yup.string(),
    phone: Yup.string().matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
  })
});

const EditProfile = () => {
  // Removed dispatch since it's not used
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      university: user?.university || '',
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || ''
      }
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.put('/users/profile', values); // Removed response variable since it's not used
        
        // Update localStorage with new user data
        const updatedUser = { ...user, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully!');
        navigate('/profile');
      } catch (error) {
        console.error('Profile update error:', error);
        toast.error(error.response?.data?.error || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/profile')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Profile
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <UserCircleIcon className="h-10 w-10 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="1234567890"
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University *
            </label>
            <div className="flex items-center">
              <BuildingLibraryIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                name="university"
                value={formik.values.university}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.university && formik.errors.university
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select your university</option>
                <option value="University of Kelaniya">University of Kelaniya</option>
                <option value="University of Colombo">University of Colombo</option>
                <option value="University of Peradeniya">University of Peradeniya</option>
                <option value="University of Moratuwa">University of Moratuwa</option>
                <option value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formik.touched.university && formik.errors.university && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.university}</p>
            )}
          </div>

          {/* Emergency Contact Section */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formik.values.emergencyContact.name}
                  onChange={formik.handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formik.values.emergencyContact.phone}
                  onChange={formik.handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Emergency contact phone"
                />
                {formik.touched.emergencyContact?.phone && formik.errors.emergencyContact?.phone && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.emergencyContact.phone}</p>
                )}
              </div>
            </div>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;