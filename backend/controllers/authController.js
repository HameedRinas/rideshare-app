const jwt = require('jsonwebtoken');
const { User } = require('../models');
const crypto = require('crypto');
const emailService = require('../services/emailService'); // Single import at the top

const authController = {
 async register(req, res, next) {
  try {
    console.log('========== REGISTER DEBUG ==========');
    console.log('1. Request body:', JSON.stringify(req.body, null, 2));
    
    const { email, universityEmail } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { universityEmail }]
    });

    if (existingUser) {
      console.log('2. User already exists:', existingUser.email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    console.log('3. Creating new user object...');
    const user = new User(req.body);
    
    // Validate the user before saving
    try {
      console.log('4. Validating user...');
      const validationError = user.validateSync();
      if (validationError) {
        console.log('5. Validation errors:', JSON.stringify(validationError.errors, null, 2));
        const errors = Object.values(validationError.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      console.log('5. Validation passed');
    } catch (validationErr) {
      console.log('5. Validation exception:', validationErr);
    }
    
    console.log('6. Saving user...');
    await user.save();
    console.log('7. User saved successfully');

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Get public profile
    const userData = user.getPublicProfile();

    console.log('8. Registration successful:', userData.email);
    console.log('========================================');

    res.status(201).json({
      message: 'Registration successful',
      token: token,
      user: userData
    });

  } catch (error) {
    console.error('========== REGISTER ERROR ==========');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error('Duplicate key error on:', field);
      return res.status(400).json({ error: `${field} already exists` });
    }
    
    console.error('Error stack:', error.stack);
    next(error);
  }
},

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      console.log('Login attempt for email:', email);

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ 
        $or: [{ email }, { universityEmail: email }] 
      });

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      const userData = user.getPublicProfile();

      console.log('Login successful for user:', email);

      res.json({
        message: 'Login successful',
        token: token,
        user: userData
      });

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  },

  async getMe(req, res) {
    res.json(req.user.getPublicProfile());
  },

  async logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const user = await User.findOne({ verificationToken: token });
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Forgot password - send reset email (SINGLE VERSION)
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      console.log('📧 Forgot password request for:', email);

      // Find user by email
      const user = await User.findOne({ 
        $or: [{ email }, { universityEmail: email }] 
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ 
          message: 'If your email is registered, you will receive a password reset link.' 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      // Save reset token to user
      await User.updateOne(
        { _id: user._id },
        { 
          $set: { 
            resetPasswordToken: resetToken,
            resetPasswordExpiry: resetTokenExpiry
          }
        }
      );

      // Send email using emailService
      await emailService.sendPasswordResetEmail(user.email, resetToken);
      
      console.log('✅ Password reset email sent to:', user.email);

      res.json({ 
        message: 'If your email is registered, you will receive a password reset link.' 
      });

    } catch (error) {
      console.error('❌ Forgot password error:', error);
      next(error);
    }
  },

  // Verify reset token
  async verifyResetToken(req, res, next) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      res.json({ message: 'Token is valid' });

    } catch (error) {
      console.error('Verify reset token error:', error);
      next(error);
    }
  },

  // Reset password
  // Reset password
async resetPassword(req, res, next) {
  try {
    console.log('========== RESET PASSWORD DEBUG ==========');
    console.log('1. Request body:', req.body);
    
    const { token, newPassword } = req.body;
    
    console.log('2. Token received:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('3. New password length:', newPassword ? newPassword.length : 'No password');
    
    // Validate input
    if (!token) {
      console.log('4. Error: No token provided');
      return res.status(400).json({ error: 'Reset token is required' });
    }
    
    if (!newPassword) {
      console.log('4. Error: No password provided');
      return res.status(400).json({ error: 'New password is required' });
    }
    
    if (newPassword.length < 6) {
      console.log('4. Error: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user with valid token
    console.log('5. Looking for user with token...');
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    console.log('6. User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      // Check if token exists but is expired
      const expiredUser = await User.findOne({ resetPasswordToken: token });
      if (expiredUser) {
        console.log('7. Token exists but expired');
        return res.status(400).json({ error: 'Reset token has expired' });
      }
      
      console.log('7. Token not found in database');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    console.log('8. User email:', user.email);
    console.log('9. Token expiry:', user.resetPasswordExpiry);
    console.log('10. Current time:', Date.now());

    // Update password
    console.log('11. Updating password...');
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    
    await user.save();
    console.log('12. Password updated successfully');

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('========== RESET PASSWORD ERROR ==========');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    next(error);
  }
}
};

module.exports = authController;