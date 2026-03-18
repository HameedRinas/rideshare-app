import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useDispatch
import { useSelector } from 'react-redux'; // Keep useSelector
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import tripService from '../../services/tripService'; // Import tripService directly
import { toast } from 'react-toastify';

const CreateTripSchema = Yup.object({
  from: Yup.string().required('Starting point is required'),
  to: Yup.string().required('Destination is required'),
  date: Yup.date()
    .min(new Date(), 'Date must be in the future')
    .required('Date and time are required'),
  price: Yup.number()
    .min(1, 'Price must be at least $1')
    .max(1000, 'Price cannot exceed $1000')
    .required('Price is required'),
  availableSeats: Yup.number()
    .min(1, 'At least 1 seat')
    .max(10, 'Maximum 10 seats')
    .required('Number of seats is required'),
  vehicleType: Yup.string().required('Vehicle type is required'),
  vehicleModel: Yup.string().required('Vehicle model is required'),
  vehicleColor: Yup.string().required('Vehicle color is required'),
  vehiclePlateNumber: Yup.string().required('License plate is required'),
  preferences: Yup.object({
    smoking: Yup.boolean(),
    music: Yup.boolean(),
    pets: Yup.boolean(),
    airConditioning: Yup.boolean(),
  }),
});

const CreateTrip = () => {
  const navigate = useNavigate(); // Removed dispatch
  const { user } = useSelector((state) => state.auth); // Keep this for the verification check
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      date: new Date(),
      price: '',
      availableSeats: 4,
      vehicleType: user?.driverDetails?.vehicleType || 'car',
      vehicleModel: user?.driverDetails?.vehicleModel || '',
      vehicleColor: user?.driverDetails?.vehicleColor || '',
      vehiclePlateNumber: user?.driverDetails?.vehiclePlateNumber || '',
      preferences: {
        smoking: false,
        music: true,
        pets: false,
        airConditioning: true,
      },
    },
    validationSchema: CreateTripSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Use tripService directly instead of dispatch
        await tripService.createTrip(values);
        toast.success('Trip created successfully!');
        navigate('/my-trips');
      } catch (error) {
        toast.error('Failed to create trip');
      } finally {
        setLoading(false);
      }
    },
  });

  // Check if user is verified driver - moved after hooks
  if (!user?.driverDetails?.isVerified) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be a verified driver to create trips.{' '}
                <button
                  onClick={() => navigate('/driver/verify')}
                  className="font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Apply for verification
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Offer a Ride</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Route Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.from && formik.errors.from
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="City or address"
                  {...formik.getFieldProps('from')}
                />
                {formik.touched.from && formik.errors.from && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.from}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.to && formik.errors.to
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="City or address"
                  {...formik.getFieldProps('to')}
                />
                {formik.touched.to && formik.errors.to && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.to}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date and Time
              </label>
              <DatePicker
                selected={formik.values.date}
                onChange={(date) => formik.setFieldValue('date', date)}
                showTimeSelect
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
              )}
            </div>
          </div>

          {/* Pricing and Seats */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per seat ($)
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.price && formik.errors.price
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  {...formik.getFieldProps('price')}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seats
                </label>
                <input
                  type="number"
                  name="availableSeats"
                  min="1"
                  max="10"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.availableSeats && formik.errors.availableSeats
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  {...formik.getFieldProps('availableSeats')}
                />
                {formik.touched.availableSeats && formik.errors.availableSeats && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.availableSeats}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleType && formik.errors.vehicleType
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  {...formik.getFieldProps('vehicleType')}
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="van">Van</option>
                  <option value="tuk-tuk">Tuk-tuk</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleModel && formik.errors.vehicleModel
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota Camry"
                  {...formik.getFieldProps('vehicleModel')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleColor && formik.errors.vehicleColor
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="e.g., Silver"
                  {...formik.getFieldProps('vehicleColor')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  name="vehiclePlateNumber"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehiclePlateNumber && formik.errors.vehiclePlateNumber
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="ABC-123"
                  {...formik.getFieldProps('vehiclePlateNumber')}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Preferences</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="preferences.smoking"
                  checked={formik.values.preferences.smoking}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Smoking allowed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="preferences.music"
                  checked={formik.values.preferences.music}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Music allowed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="preferences.pets"
                  checked={formik.values.preferences.pets}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Pets allowed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="preferences.airConditioning"
                  checked={formik.values.preferences.airConditioning}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Air conditioning</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;