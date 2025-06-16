
import express from 'express';
import { 
  sendForgotPasswordOTP, 
  verifyForgotPasswordOTP, 
  resetPassword 
} from '../controllers/emailController';
import { testEmailConnection } from '../utils/emailService';

const router = express.Router();

// Test email connection endpoint
router.get('/test-connection', async (req, res) => {
  try {
    const isConnected = await testEmailConnection();
    res.json({ 
      connected: isConnected,
      message: isConnected ? 'Email service is working' : 'Email service connection failed'
    });
  } catch (error: any) {
    res.status(500).json({ 
      connected: false, 
      message: 'Email service test failed',
      error: error.message 
    });
  }
});

// Send forgot password OTP
router.post('/send-forgot-password-otp', sendForgotPasswordOTP);

// Verify forgot password OTP
router.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);

// Reset password
router.post('/reset-password', resetPassword);

export default router;
