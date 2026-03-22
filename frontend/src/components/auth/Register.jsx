import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { 
  AcademicCapIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';

const RegisterSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
    .required('Phone number is required'),
  userType: Yup.string().oneOf(['student', 'driver']).required('Select user type'),
  
  // Student-only fields
  universityEmail: Yup.string().when('userType', {
    is: 'student',
    then: () => Yup.string()
      .email('Invalid university email')
      .required('University email is required for students')
      .matches(/\.ac\.lk$/, 'Must be a valid .ac.lk email'), // Fixed regex
    otherwise: () => Yup.string().notRequired()
  }),
  
  university: Yup.string().when('userType', {
    is: 'student',
    then: () => Yup.string().required('University is required for students'),
    otherwise: () => Yup.string().notRequired()
  }),

  // Driver-only fields
  driverLicense: Yup.string().when('userType', {
    is: 'driver',
    then: () => Yup.string().required('Driver license is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  vehicleType: Yup.string().when('userType', {  // ← ADD THIS
  is: 'driver',
  then: () => Yup.string().required('Vehicle type is required'),
  otherwise: () => Yup.string().notRequired()
}),
  vehicleModel: Yup.string().when('userType', {
    is: 'driver',
    then: () => Yup.string().required('Vehicle model is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  
  vehicleColor: Yup.string().when('userType', {
    is: 'driver',
    then: () => Yup.string().required('Vehicle color is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  
  vehiclePlate: Yup.string().when('userType', {
    is: 'driver',
    then: () => Yup.string().required('License plate is required'),
    otherwise: () => Yup.string().notRequired()
  })
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [userType, setUserType] = useState('student');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      userType: 'student',
      universityEmail: '',
      password: '',
      confirmPassword: '',
      university: '',
      phone: '',
      driverLicense: '',
      vehicleType: '',
      vehicleModel: '',
      vehicleColor: '',
      vehiclePlate: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('=== REGISTRATION DEBUG ===');
      console.log('1. Raw form values:', values);
      
      // Prepare data based on user type
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.userType === 'student' ? 'rider' : 'driver',
        userType: values.userType
      };

      // Add student-specific fields
      if (values.userType === 'student') {
        userData.universityEmail = values.universityEmail;
        userData.university = values.university;
        userData.isStudent = true;
        console.log('2a. Student data:', { 
          universityEmail: values.universityEmail, 
          university: values.university 
        });
      }

      // Add driver-specific fields
      if (values.userType === 'driver') {
        userData.driverDetails = {
          licenseNumber: values.driverLicense,
          vehicleType: values.vehicleType || 'car',
          vehicleModel: values.vehicleModel,
          vehicleColor: values.vehicleColor,
          vehiclePlateNumber: values.vehiclePlate,
          availableSeats: 4,
          isVerified: false,
          isStudent: false
        };
        console.log('2b. Driver data:', userData.driverDetails);
      }

      console.log('3. Final userData being sent:', JSON.stringify(userData, null, 2));
      
      const result = await dispatch(register(userData));
      console.log('4. Dispatch result:', result);
      
      if (register.fulfilled.match(result)) {
        console.log('5. Registration successful!');
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        console.log('5. Registration failed:', result.payload);
        if (result.payload?.error) {
          toast.error(result.payload.error);
        }
      }
    },
  });

  // Update formik values when userType changes
  const handleUserTypeChange = (type) => {
    setUserType(type);
    formik.setFieldValue('userType', type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleUserTypeChange('student')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center ${
              userType === 'student'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AcademicCapIcon className={`h-8 w-8 ${
              userType === 'student' ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <span className={`mt-2 font-medium ${
              userType === 'student' ? 'text-primary-600' : 'text-gray-600'
            }`}>
              Student
            </span>
            <span className="text-xs text-gray-500">(Need rides)</span>
          </button>

          <button
            type="button"
            onClick={() => handleUserTypeChange('driver')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center ${
              userType === 'driver'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TruckIcon className={`h-8 w-8 ${
              userType === 'driver' ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <span className={`mt-2 font-medium ${
              userType === 'driver' ? 'text-primary-600' : 'text-gray-600'
            }`}>
              Driver
            </span>
            <span className="text-xs text-gray-500">(Offer rides)</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          {/* Common Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="vehicleType"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('phone')}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
              )}
            </div>

            {/* Student-specific fields */}
            {userType === 'student' && (
              <>
                <div>
                  <label htmlFor="universityEmail" className="block text-sm font-medium text-gray-700">
                    University Email (.ac.lk)
                  </label>
                  <input
                    id="universityEmail"
                    name="universityEmail"
                    type="email"
                    placeholder="student@university.ac.lk"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                      formik.touched.universityEmail && formik.errors.universityEmail
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    {...formik.getFieldProps('universityEmail')}
                  />
                  {formik.touched.universityEmail && formik.errors.universityEmail && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.universityEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                    University/College
                  </label>
                  <select
                    id="university"
                    name="university"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                      formik.touched.university && formik.errors.university
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    {...formik.getFieldProps('university')}
                  >
                    <option value="">Select your university</option>
                    <option value="University of Kelaniya">University of Kelaniya</option>
                    <option value="University of Colombo">University of Colombo</option>
                    <option value="University of Peradeniya">University of Peradeniya</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.university && formik.errors.university && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.university}</p>
                  )}
                </div>
              </>
            )}

            {/* Driver-specific fields */}
 {userType === 'driver' && (
  <>
    <div>
      <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">
        Driver License Number
      </label>
      <input
        id="driverLicense"
        name="driverLicense"
        type="text"
        className="mt-1 block w-full px-3 py-2 border rounded-md"
        {...formik.getFieldProps('driverLicense')}
      />
      {formik.touched.driverLicense && formik.errors.driverLicense && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.driverLicense}</p>
      )}
    </div>

    {/* ADD THIS - VEHICLE TYPE SELECT */}
    <div>
      <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
        Vehicle Type
      </label>
      <select
        id="vehicleType"
        name="vehicleType"
        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
          formik.touched.vehicleType && formik.errors.vehicleType
            ? 'border-red-300'
            : 'border-gray-300'
        }`}
        {...formik.getFieldProps('vehicleType')}
      >
        <option value="">Select vehicle type</option>
        <option value="car">Car</option>
        <option value="motorcycle">Motorcycle</option>
        <option value="van">Van</option>
        <option value="tuk-tuk">Tuk-tuk</option>
        <option value="other">Other</option>
      </select>
      {formik.touched.vehicleType && formik.errors.vehicleType && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.vehicleType}</p>
      )}
    </div>

    <div>
      <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
        Vehicle Model
      </label>
      <input
        id="vehicleModel"
        name="vehicleModel"
        type="text"
        placeholder="e.g., Toyota Camry"
        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
          formik.touched.vehicleModel && formik.errors.vehicleModel
            ? 'border-red-300'
            : 'border-gray-300'
        }`}
        {...formik.getFieldProps('vehicleModel')}
      />
      {formik.touched.vehicleModel && formik.errors.vehicleModel && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.vehicleModel}</p>
      )}
    </div>

    <div>
      <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-700">
        Vehicle Color
      </label>
      <input
        id="vehicleColor"
        name="vehicleColor"
        type="text"
        placeholder="e.g., Silver"
        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
          formik.touched.vehicleColor && formik.errors.vehicleColor
            ? 'border-red-300'
            : 'border-gray-300'
        }`}
        {...formik.getFieldProps('vehicleColor')}
      />
      {formik.touched.vehicleColor && formik.errors.vehicleColor && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.vehicleColor}</p>
      )}
    </div>

    <div>
      <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700">
        License Plate
      </label>
      <input
        id="vehiclePlate"
        name="vehiclePlate"
        type="text"
        placeholder="ABC-123"
        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
          formik.touched.vehiclePlate && formik.errors.vehiclePlate
            ? 'border-red-300'
            : 'border-gray-300'
        }`}
        {...formik.getFieldProps('vehiclePlate')}
      />
      {formik.touched.vehiclePlate && formik.errors.vehiclePlate && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.vehiclePlate}</p>
      )}
    </div>
  </>
)}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                {...formik.getFieldProps('confirmPassword')}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-gray-600 text-center">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;