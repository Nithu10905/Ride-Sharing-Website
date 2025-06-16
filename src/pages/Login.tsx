import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import OTPVerification from '@/components/features/OTPVerification';
import GoogleLoginPopup from '@/components/features/GoogleLoginPopup';
import FacebookLoginPopup from '@/components/features/FacebookLoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/api/emailService';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [showFacebookPopup, setShowFacebookPopup] = useState(false);
  
  const from = (location.state as { from?: string })?.from || '/';
  
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, send OTP for login verification
      await emailService.sendForgotPasswordOTP(email);
      
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your email for secure login",
      });
      setStep('otp');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOTPVerification = async (otp: string): Promise<boolean> => {
    try {
      // Verify OTP first
      await emailService.verifyForgotPasswordOTP(email, otp);
      
      // Then complete login
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      navigate(from);
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleGoogleLogin = () => {
    setShowGooglePopup(true);
  };

  const handleGoogleAccountSelect = async (account: any) => {
    setShowGooglePopup(false);
    setIsLoading(true);
    
    try {
      toast({
        title: "Authenticating",
        description: `Signing in as ${account.name}...`,
      });
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Complete login with selected Google account
      await login(account.email, "google-oauth-token");
      
      toast({
        title: "Success",
        description: `Welcome back, ${account.name}!`,
      });
      
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Google login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    setShowFacebookPopup(true);
  };

  const handleFacebookAccountSelect = async (account: any) => {
    setShowFacebookPopup(false);
    setIsLoading(true);
    
    try {
      toast({
        title: "Authenticating",
        description: `Signing in as ${account.name}...`,
      });
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Complete login with selected Facebook account
      await login(account.email, "facebook-oauth-token");
      
      toast({
        title: "Success",
        description: `Welcome back, ${account.name}!`,
      });
      
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Facebook login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          {step === 'credentials' ? (
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600 mt-2">Sign in to your account</p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Continue with OTP"}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                      Sign up
                    </Link>
                  </div>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-500">Or continue with</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 border-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Google
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 border-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      onClick={handleFacebookLogin}
                      disabled={isLoading}
                    >
                      <Lock className="h-5 w-5 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <OTPVerification
              email={email}
              title="Secure Login Verification"
              subtitle="Enter the verification code sent to your email to complete login"
              type="forgot-password"
              onVerificationSuccess={handleOTPVerification}
              onBack={() => setStep('credentials')}
            />
          )}
        </div>
      </div>
      
      {/* Google Login Popup */}
      {showGooglePopup && (
        <GoogleLoginPopup
          onAccountSelect={handleGoogleAccountSelect}
          onClose={() => setShowGooglePopup(false)}
        />
      )}
      
      {/* Facebook Login Popup */}
      {showFacebookPopup && (
        <FacebookLoginPopup
          onAccountSelect={handleFacebookAccountSelect}
          onClose={() => setShowFacebookPopup(false)}
        />
      )}
    </Layout>
  );
};

export default Login;
