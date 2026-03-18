const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Headers:', req.headers);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received (first 20 chars):', token.substring(0, 20) + '...');
      
      // Check if token looks like a real JWT (should have 3 parts separated by dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Token does not have 3 parts, got:', tokenParts.length);
        return res.status(401).json({
          success: false,
          error: 'Malformed token - invalid format'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
      console.log('Decoded token:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      console.log('User found:', user.email);
      
      // Attach user to request
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role
      };
      
      console.log('Auth middleware successful');
      next();
      
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token: ' + error.message
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired'
        });
      }
      
      return res.status(401).json({
        success: false,
        error: 'Not authorized: ' + error.message
      });
    }
  } else {
    console.log('No token provided in authorization header');
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

module.exports = { protect };