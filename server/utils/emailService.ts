
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Email Service Configuration:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET');

// Validate email configuration
const validateEmailConfig = () => {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing email configuration:', missing.join(', '));
    return false;
  }
  
  console.log('✅ Email configuration validated');
  return true;
};

// Create transporter with Gmail configuration
let transporter: nodemailer.Transporter | null = null;

const createTransporter = () => {
  if (!validateEmailConfig()) {
    console.error('❌ Cannot create transporter - invalid configuration');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });

    console.log('✅ Email transporter created successfully');
    return transporter;
  } catch (error: any) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

// Initialize transporter
createTransporter();

// Generate OTP
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('🎲 Generated OTP:', otp);
  return otp;
};

// Send OTP email function
export const sendOTPEmail = async (
  email: string, 
  otp: string, 
  type: 'forgot-password' | 'verification' = 'verification'
): Promise<boolean> => {
  console.log('📧 Starting email send process...');
  console.log('📧 Email:', email);
  console.log('🔑 OTP:', otp);
  console.log('📝 Type:', type);

  // Validate inputs
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  if (!email.includes('@') || !email.includes('.')) {
    throw new Error('Invalid email format');
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error('OTP must be 6 digits');
  }

  // Ensure transporter exists
  if (!transporter) {
    console.log('🔄 Transporter not found, recreating...');
    if (!createTransporter()) {
      throw new Error('Email service not configured properly');
    }
  }

  const subject = type === 'forgot-password' ? 'Password Reset OTP - Rideshare' : 'Email Verification OTP - Rideshare';
  const title = type === 'forgot-password' ? 'Reset Your Password' : 'Verify Your Email';
  
  const mailOptions = {
    from: `"Rideshare App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background-color: #f8fafc; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
            border-radius: 12px; 
            padding: 40px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #3b82f6; 
            margin-bottom: 10px;
          }
          .otp-container { 
            background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
            padding: 30px; 
            border-radius: 12px; 
            text-align: center; 
            margin: 30px 0; 
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: white; 
            letter-spacing: 8px; 
            margin: 15px 0; 
            font-family: 'Courier New', monospace;
          }
          .content { 
            text-align: center; 
            color: #374151; 
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 14px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .warning {
            background-color: #fef3cd;
            border: 1px solid #facc15;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚗 Rideshare</div>
            <h1 style="color: #1f2937; margin: 0;">${title}</h1>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">
              You have requested ${type === 'forgot-password' ? 'to reset your password' : 'to verify your email address'}. 
              Please use the verification code below:
            </p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <p style="color: white; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> Never share this code with anyone. Rideshare staff will never ask for your OTP.
            </div>
            
            <p style="font-size: 14px;">
              If you didn't request this verification, please ignore this email and ensure your account is secure.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Rideshare App. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('📤 Sending email with transporter...');
    console.log('📤 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter!.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    console.log('✉️ Accepted:', info.accepted);
    console.log('❌ Rejected:', info.rejected);
    
    return true;
  } catch (error: any) {
    console.error('❌ DETAILED EMAIL SEND ERROR:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Provide specific error handling
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      throw new Error('Gmail authentication failed. Please verify your email and app password are correct.');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      throw new Error('Cannot connect to Gmail servers. Please check your internet connection.');
    } else if (error.code === 'EMESSAGE') {
      throw new Error('Invalid email message format.');
    } else if (error.responseCode === 550) {
      throw new Error('Email address not found or invalid.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing email connection...');
    
    if (!validateEmailConfig()) {
      console.error('❌ Email configuration is invalid');
      return false;
    }
    
    if (!transporter) {
      console.log('🔄 Creating transporter for test...');
      if (!createTransporter()) {
        console.error('❌ Failed to create transporter for test');
        return false;
      }
    }
    
    console.log('🔍 Verifying transporter...');
    await transporter!.verify();
    
    console.log('✅ Email server connection verified successfully!');
    console.log('✅ Ready to send emails');
    return true;
  } catch (error: any) {
    console.error('❌ Email server connection test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check your Gmail app password');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - check your internet connection');
    }
    
    return false;
  }
};

// Initialize connection test
console.log('🚀 Initializing email service...');
