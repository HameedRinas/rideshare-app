import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  IdentificationIcon, 
  TruckIcon,
  DocumentCheckIcon,
  CameraIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DriverVerificationSchema = Yup.object({
  licenseNumber: Yup.string().required('License number is required'),
  licenseExpiry: Yup.date()
    .min(new Date(), 'License must not be expired')
    .required('License expiry date is required'),
  vehicleType: Yup.string().required('Vehicle type is required'),
  vehicleModel: Yup.string().required('Vehicle model is required'),
  vehicleColor: Yup.string().required('Vehicle color is required'),
  vehiclePlateNumber: Yup.string().required('License plate is required'),
});

const DriverVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  // Removed setUploadProgress since it's not used

  const formik = useFormik({
    initialValues: {
      licenseNumber: '',
      licenseExpiry: '',
      vehicleType: 'car',
      vehicleModel: '',
      vehicleColor: '',
      vehiclePlateNumber: '',
    },
    validationSchema: DriverVerificationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log('=== DRIVER VERIFICATION SUBMISSION ===');
        console.log('1. Form values:', values);
        console.log('2. Files to upload:', files.length);
        
        // Submit driver details
        const detailsResponse = await api.post('/users/become-driver', values);
        console.log('3. Details response:', detailsResponse.data);
        
        // Upload documents if any
        if (files.length > 0) {
          console.log('4. Uploading documents...');
          const formData = new FormData();
          files.forEach(file => {
            formData.append('verificationDocuments', file);
          });
          
          const uploadResponse = await api.post('/users/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('5. Upload response:', uploadResponse.data);
        }
        
        toast.success('Verification application submitted successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('6. Error:', error);
        console.error('7. Error response:', error.response?.data);
        toast.error(error.response?.data?.error || 'Failed to submit verification');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('Files selected:', selectedFiles.map(f => f.name));
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <DocumentCheckIcon className="h-16 w-16 text-primary-600 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Driver Verification</h1>
          <p className="text-gray-600 mt-2">
            Please provide your details and documents to become a verified driver
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* License Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IdentificationIcon className="h-5 w-5 mr-2 text-primary-600" />
              Driver's License Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formik.values.licenseNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.licenseNumber && formik.errors.licenseNumber
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formik.values.licenseExpiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.licenseExpiry && formik.errors.licenseExpiry
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.licenseExpiry && formik.errors.licenseExpiry && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.licenseExpiry}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TruckIcon className="h-5 w-5 mr-2 text-primary-600" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formik.values.vehicleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleType && formik.errors.vehicleType
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
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
                  value={formik.values.vehicleModel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Toyota Camry"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleModel && formik.errors.vehicleModel
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formik.values.vehicleColor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Silver"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehicleColor && formik.errors.vehicleColor
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  name="vehiclePlateNumber"
                  value={formik.values.vehiclePlateNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ABC-123"
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.vehiclePlateNumber && formik.errors.vehiclePlateNumber
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CameraIcon className="h-5 w-5 mr-2 text-primary-600" />
              Verification Documents
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <div className="mt-4 flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload documents</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, DOC up to 5MB each
                </p>
              </div>
              
              {/* File list with remove option */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Selected files:</h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Your information will be verified within 24-48 hours. You'll receive an email once verified.
          </p>
        </form>
      </div>
    </div>
  );
};

export default DriverVerification;