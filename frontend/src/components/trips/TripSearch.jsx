import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { searchTrips, setSearchParams } from '../../store/slices/tripSlice';
import TripCard from './TripCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchSchema = Yup.object({
  from: Yup.string().required('Starting point is required'),
  to: Yup.string().required('Destination is required'),
  date: Yup.date().nullable(),
  passengers: Yup.number().min(1, 'At least 1 passenger').max(10, 'Max 10 passengers'),
});

const TripSearch = () => {
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((state) => state.trips);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      date: null,
      passengers: 1,
    },
    validationSchema: SearchSchema,
    onSubmit: async (values) => {
      dispatch(setSearchParams(values));
      const result = await dispatch(searchTrips(values));
      if (result.payload) {
        setSearchPerformed(true);
      }
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Ride</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="text"
                id="from"
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.from && formik.errors.from
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Leaving from..."
                {...formik.getFieldProps('from')}
              />
              {formik.touched.from && formik.errors.from && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.from}</p>
              )}
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                id="to"
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.to && formik.errors.to
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Going to..."
                {...formik.getFieldProps('to')}
              />
              {formik.touched.to && formik.errors.to && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.to}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                selected={formik.values.date}
                onChange={(date) => formik.setFieldValue('date', date)}
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                dateFormat="MM/dd/yyyy"
              />
            </div>

            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <input
                type="number"
                id="passengers"
                min="1"
                max="10"
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.passengers && formik.errors.passengers
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('passengers')}
              />
              {formik.touched.passengers && formik.errors.passengers && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.passengers}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              {loading ? 'Searching...' : 'Search Rides'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchPerformed && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Rides ({trips.length})
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No rides found. Try different search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripSearch;