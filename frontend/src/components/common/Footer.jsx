import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TruckIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">RideShare</span>
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              Safe, affordable, and eco-friendly ridesharing for students. 
              Join our community and make your commute better.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white text-sm">
                  Find a Ride
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                support@rideshare.com
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <PhoneIcon className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <MapPinIcon className="h-4 w-4 mr-2" />
                123 University Ave, City, ST 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RideShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;