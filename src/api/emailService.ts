
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface EmailResponse {
  message: string;
  email?: string;
  verified?: boolean;
  success?: boolean;
  debug?: any;
}

export const emailService = {
  // Send forgot password OTP
  sendForgotPasswordOTP: async (email: string): Promise<EmailResponse> => {
    try {
      console.log('📧 Sending forgot password OTP to:', email);
      const response = await axios.post(`${API_BASE_URL}/email/send-forgot-password-otp`, {
        email
      });
      console.log('✅ OTP sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to send OTP:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 8080.');
      }
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify forgot password OTP
  verifyForgotPasswordOTP: async (email: string, otp: string): Promise<EmailResponse> => {
    try {
      console.log('🔐 Verifying OTP:', otp, 'for email:', email);
      const response = await axios.post(`${API_BASE_URL}/email/verify-forgot-password-otp`, {
        email,
        otp
      });
      console.log('✅ OTP verified successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to verify OTP:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 8080.');
      }
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  },

  // Reset password
  resetPassword: async (email: string, newPassword: string): Promise<EmailResponse> => {
    try {
      console.log('🔑 Resetting password for email:', email);
      const response = await axios.post(`${API_BASE_URL}/email/reset-password`, {
        email,
        newPassword
      });
      console.log('✅ Password reset successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to reset password:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 8080.');
      }
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Test backend connection
  testConnection: async (): Promise<boolean> => {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await axios.get(`${API_BASE_URL}/email/test-connection`);
      console.log('✅ Backend connection successful:', response.data);
      return response.data.connected;
    } catch (error: any) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  }
};
