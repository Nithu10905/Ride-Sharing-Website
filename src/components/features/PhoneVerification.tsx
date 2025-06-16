
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Phone, CheckCircle } from 'lucide-react';

interface PhoneVerificationProps {
  phoneNumber: string;
  isVerified: boolean;
  onVerify: () => void;
}

export const PhoneVerification = ({ phoneNumber, isVerified, onVerify }: PhoneVerificationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please add your phone number first to verify it.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "OTP sent",
      description: `6-digit verification code sent to ${phoneNumber}`,
    });
    
    setStep('verify');
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any 6-digit code
    onVerify();
    setIsOpen(false);
    setStep('send');
    setOtp('');
    setIsLoading(false);
    
    toast({
      title: "Phone verified successfully",
      description: "Your phone number has been verified with OTP!",
    });
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "OTP resent",
      description: `New verification code sent to ${phoneNumber}`,
    });
    
    setOtp('');
    setIsLoading(false);
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Phone (OTP Verified)</span>
        </div>
        <span className="text-green-600 text-sm font-semibold">Verified</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
      <div className="flex items-center space-x-3">
        <Phone className="w-5 h-5 text-orange-600" />
        <span className="font-medium text-orange-800">Phone (OTP Required)</span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
            disabled={!phoneNumber}
          >
            Verify with OTP
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>OTP Verification</DialogTitle>
            <DialogDescription>
              {step === 'send' 
                ? `We'll send a 6-digit OTP to ${phoneNumber}`
                : `Enter the 6-digit OTP sent to ${phoneNumber}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {step === 'send' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">A 6-digit OTP will be sent to this number</p>
                </div>
                <Button 
                  onClick={handleSendOTP} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-blue-600"
                    >
                      Didn't receive? Resend OTP
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('send')}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerifyOTP}
                    className="flex-1"
                    disabled={otp.length !== 6 || isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
