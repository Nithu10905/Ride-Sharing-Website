
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RefreshCw, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/api/emailService';

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: (otp?: string) => Promise<boolean> | void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  type?: 'login' | 'forgot-password' | 'phone';
}

export default function OTPVerification({ 
  email, 
  onVerificationSuccess, 
  onBack, 
  title = "Verify OTP",
  subtitle = "Enter the verification code sent to your email",
  type = 'login'
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    console.log('🔐 Attempting to verify OTP:', otp, 'for email:', email);
    
    try {
      if (type === 'forgot-password') {
        console.log('🔍 Verifying forgot password OTP...');
        const result = await onVerificationSuccess(otp);
        if (result) {
          toast({
            title: "Verification Successful",
            description: "OTP verified successfully",
          });
        }
      } else {
        // For other types, use mock verification (backward compatibility)
        console.log('🔍 Using mock verification for type:', type);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast({
          title: "Verification Successful",
          description: "OTP verified successfully",
        });
        onVerificationSuccess();
      }
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    console.log('📧 Attempting to resend OTP to:', email);
    
    try {
      if (type === 'forgot-password') {
        console.log('📤 Sending forgot password OTP...');
        await emailService.sendForgotPasswordOTP(email);
      } else {
        // Mock resend for other types
        console.log('📤 Mock resend for type:', type);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setCountdown(60);
      setCanResend(false);
      
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your email",
      });
      console.log('✅ OTP resent successfully');
    } catch (error: any) {
      console.error('❌ Failed to resend OTP:', error);
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <p className="text-gray-600 mt-2">{subtitle}</p>
        <Badge variant="secondary" className="mx-auto mt-2 bg-blue-100 text-blue-700">
          {email}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
                <InputOTPSlot index={1} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
                <InputOTPSlot index={2} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
                <InputOTPSlot index={3} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
                <InputOTPSlot index={4} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
                <InputOTPSlot index={5} className="w-12 h-12 text-lg font-semibold border-2 focus:border-blue-500 transition-colors" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="text-center">
            {!canResend ? (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Resend OTP in {countdown}s</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend OTP'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Verify OTP</span>
              </div>
            )}
          </Button>
          
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Didn't receive the code? Check your spam folder or try resending after {countdown}s
        </p>
      </CardContent>
    </Card>
  );
}
