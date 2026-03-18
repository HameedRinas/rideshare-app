import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'; // Removed TruckIcon and StarIcon

const HomePage = () => {
  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Find Rides Easily',
      description: 'Search for rides to and from your university with just a few clicks.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Students',
      description: 'All users are verified with their university email for safety.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Affordable Prices',
      description: 'Share costs and save money on your daily commute.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Join a community of students helping each other.'
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Daily Rides', value: '500+' },
    { label: 'Universities', value: '50+' },
    { label: 'Safe Rides', value: '100%' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Carpool"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Share Rides, Save Money
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Connect with fellow students for safe, affordable, and eco-friendly rides to and from your university.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
            >
              Find a Ride
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose RideShare?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Safe, affordable, and convenient rides for students
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-lg text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="bg-primary-100 rounded-full p-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create an Account</h3>
                <p className="mt-2 text-gray-500">
                  Sign up with your university email to verify your student status.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="bg-primary-100 rounded-full p-4">
                    <span className="text-2xl font-bold text-primary-600">2</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Find or Offer a Ride</h3>
                <p className="mt-2 text-gray-500">
                  Search for available rides or offer seats in your vehicle.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="bg-primary-100 rounded-full p-4">
                    <span className="text-2xl font-bold text-primary-600">3</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Book and Go</h3>
                <p className="mt-2 text-gray-500">
                  Book your seat, meet the driver, and enjoy the ride!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-600">Join RideShare today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign Up Now
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Find a Ride
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;