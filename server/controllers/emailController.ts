
import { Request, Response } from 'express';
import { sendOTPEmail, generateOTP, testEmailConnection } from '../utils/emailService';
import OTP from '../models/OTP';
import User from '../models/User';

// @desc    Send OTP for forgot password
// @route   POST /api/email/send-forgot-password-otp
// @access  Public
export const sendForgotPasswordOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🚀 Forgot password OTP request received');
    const { email } = req.body;

    if (!email) {
      console.log('❌ No email provided');
      res.status(400).json({ 
        message: 'Email is required',
        success: false 
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
      return;
    }

    console.log('🔍 Looking for user with email:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found with email:', email);
      res.status(404).json({ 
        message: 'No account found with this email address',
        success: false 
      });
      return;
    }

    console.log('✅ User found, testing email connection...');

    // Test email connection first
    const connectionTest = await testEmailConnection();
    if (!connectionTest) {
      console.log('❌ Email connection test failed');
      res.status(500).json({ 
        message: 'Email service is currently unavailable. Please try again later.',
        success: false
      });
      return;
    }

    console.log('✅ Email connection test passed, generating OTP...');

    // Generate OTP
    const otp = generateOTP();
    console.log('🎲 Generated OTP:', otp);

    // Remove any existing OTPs for this email and type
    await OTP.deleteMany({ email, type: 'forgot-password' });
    console.log('🗑️ Removed existing OTPs');

    // Save OTP to database
    const otpDoc = new OTP({
      email,
      otp,
      type: 'forgot-password',
    });
    await otpDoc.save();
    console.log('💾 OTP saved to database');

    // Send email
    console.log('📧 Attempting to send email...');
    await sendOTPEmail(email, otp, 'forgot-password');
    console.log('✅ Email sent successfully!');
    
    res.json({ 
      message: 'OTP sent successfully to your email',
      email,
      success: true,
      debug: process.env.NODE_ENV === 'development' ? { otp } : undefined
    });
    
  } catch (error: any) {
    console.error('💥 Error in sendForgotPasswordOTP:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to send OTP. Please try again.';
    if (error.message.includes('Gmail authentication')) {
      errorMessage = 'Email service configuration error. Please contact support.';
    } else if (error.message.includes('connect')) {
      errorMessage = 'Cannot connect to email service. Please try again later.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP for forgot password
// @route   POST /api/email/verify-forgot-password-otp
// @access  Public
export const verifyForgotPasswordOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 OTP verification request received');
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.log('❌ Missing email or OTP');
      res.status(400).json({ 
        message: 'Email and OTP are required',
        success: false 
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
      return;
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      console.log('❌ Invalid OTP format:', otp);
      res.status(400).json({ 
        message: 'OTP must be 6 digits',
        success: false 
      });
      return;
    }

    console.log('🔍 Verifying OTP for email:', email);

    // Find and verify OTP
    const otpDoc = await OTP.findOne({ 
      email, 
      otp, 
      type: 'forgot-password',
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      console.log('❌ Invalid or expired OTP');
      res.status(400).json({ 
        message: 'Invalid or expired OTP. Please request a new one.',
        success: false 
      });
      return;
    }

    console.log('✅ OTP verified successfully');

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpDoc._id });
    console.log('🗑️ Used OTP deleted');

    res.json({ 
      message: 'OTP verified successfully',
      verified: true,
      success: true
    });
  } catch (error: any) {
    console.error('💥 Error in verifyForgotPasswordOTP:', error);
    res.status(500).json({ 
      message: 'Failed to verify OTP. Please try again.',
      verified: false,
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reset password after OTP verification
// @route   POST /api/email/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔑 Password reset request received');
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      console.log('❌ Missing email or password');
      res.status(400).json({ 
        message: 'Email and new password are required',
        success: false 
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        success: false 
      });
      return;
    }

    console.log('🔍 Finding user for password reset:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found for password reset');
      res.status(404).json({ 
        message: 'User not found',
        success: false 
      });
      return;
    }

    // Hash and update password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log('✅ Password reset successfully');

    res.json({ 
      message: 'Password reset successfully',
      success: true 
    });
  } catch (error: any) {
    console.error('💥 Error in resetPassword:', error);
    res.status(500).json({ 
      message: 'Failed to reset password. Please try again.',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
