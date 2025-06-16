
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PublishRideWizard from '@/components/features/PublishRideWizard';
import { useAuth } from '@/contexts/AuthContext';
import { Car, MessageCircle, Shield, AlertCircle, Star, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IDVerification } from '@/components/features/IDVerification';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Publish = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [openFaqModal, setOpenFaqModal] = useState<null | 'pricing' | 'payment'>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/publish' } });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }

  const isUserVerified = user?.isIDVerified || false;

  const testimonials = [
    {
      message: "More than 400€ paid into my account thanks to RideShare, even though I've only been using it for a few months... There's no denying how good their app is!",
      author: "Daniel",
      rating: 5
    },
    {
      message: "Amazing experience! I've saved so much money on fuel costs by sharing rides with friendly passengers. The app is super easy to use.",
      author: "Priya",
      rating: 5
    },
    {
      message: "Been using RideShare for 6 months now. Great way to meet new people and cover travel expenses. Highly recommend to all drivers!",
      author: "Rajesh",
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Active Users" },
    { icon: Car, value: "25,000+", label: "Rides Published" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];
  
  return (
    <Layout>
      {/* Hero Section with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* 3D Phone Mockup */}
        <div className="absolute right-8 top-8 hidden lg:block">
          <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-500">
            <div className="w-64 h-96 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl border-8 border-gray-800 relative overflow-hidden">
              {/* Phone Screen */}
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-white font-bold text-lg mb-2">RideShare</h3>
                  <p className="text-blue-100 text-sm">Find your perfect ride</p>
                </div>
                
                <div className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-gray-800 font-semibold text-lg mb-2">Ready to go?</h4>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    Find rides, connect with drivers, and travel sustainably
                  </p>
                  
                  {/* Dots indicator */}
                  <div className="flex space-x-2 mt-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Phone Details */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Star className="w-4 h-4 text-yellow-800" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Testimonial Carousel */}
        <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-gray-800 relative shadow-2xl min-h-[240px] flex flex-col justify-center border border-white/20">
                      <div className="text-center">
                        {/* Stars */}
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        
                        <blockquote className="text-xl md:text-2xl italic font-medium leading-relaxed mb-6 text-gray-700">
                          "{testimonial.message}"
                        </blockquote>
                        
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {testimonial.author[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-700 text-lg">@{testimonial.author}</p>
                            <p className="text-sm text-gray-500">Verified Driver</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/90 text-blue-800 border-white shadow-lg hover:bg-white" />
              <CarouselNext className="right-4 bg-white/90 text-blue-800 border-white shadow-lg hover:bg-white" />
            </Carousel>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {!isUserVerified && (
            <div className="mb-8">
              <Alert className="border-orange-200 bg-orange-50/85 shadow-md">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Verification Required:</strong> You need to verify your ID before you can publish rides. This helps ensure the safety and security of all users.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight">
                  Publish your ride in minutes
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with passengers, earn money, and make traveling more sustainable. Join thousands of drivers already earning with RideShare.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                {!isUserVerified ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Complete ID Verification</h3>
                      <p className="text-gray-600 mb-6">Verify your identity to start publishing rides and build trust with passengers</p>
                    </div>
                    <IDVerification />
                  </div>
                ) : (
                  <PublishRideWizard />
                )}
              </div>
            </div>
            
            <div className="space-y-8">
              {/* How it works */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">How it works</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Create your profile</h4>
                      <p className="text-gray-600">Add your photo, verify your identity, and share a bit about yourself to build trust with passengers.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">2</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Publish your ride</h4>
                      <p className="text-gray-600">Set your route, departure time, and price. Our smart pricing suggestions help you get bookings faster.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Accept bookings</h4>
                      <p className="text-gray-600">Review passenger profiles and accept requests. Start earning and help reduce traffic!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-2">Safe & Secure</h4>
                  <p className="text-blue-700 text-sm">ID verification and secure payments</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Quick Setup</h4>
                  <p className="text-green-700 text-sm">Publish rides in under 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">We're here every step of the way</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">24/7 Support</h3>
                <p className="text-gray-600">
                  Our support team is available around the clock to help you with any questions or issues.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl mb-6 flex items-center justify-center">
                  <Car className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Driver Protection</h3>
                <p className="text-gray-600">
                  Comprehensive insurance coverage and driver protection for peace of mind on every ride.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Secure Platform</h3>
                <p className="text-gray-600">
                  Advanced security measures and data encryption to keep your information safe and protected.
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How do I set the right price?</h3>
                <p className="text-gray-600 mb-4">
                  We recommend fair pricing based on distance, time, and demand. You can always adjust prices to optimize bookings...
                </p>
                <Button
                  variant="link"
                  className="text-blue-600 px-0 font-semibold"
                  onClick={() => setOpenFaqModal('pricing')}
                >
                  Learn more →
                </Button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">When do I get paid?</h3>
                <p className="text-gray-600 mb-4">
                  Payments are processed 48 hours after ride completion. Money is transferred to your account within 1-5 business days...
                </p>
                <Button
                  variant="link"
                  className="text-blue-600 px-0 font-semibold"
                  onClick={() => setOpenFaqModal('payment')}
                >
                  Learn more →
                </Button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Publish Button */}
          <div className="mt-16 text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <Button 
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-full text-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              >
                <Car className="w-6 h-6 mr-3" />
                Publish Your Ride Now
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-800" />
                </div>
              </Button>
            </div>
            <p className="text-gray-500 mt-4 text-sm">Join thousands of drivers earning with RideShare</p>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      <Dialog open={!!openFaqModal} onOpenChange={() => setOpenFaqModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {openFaqModal === 'pricing' ? 'Setting Fair Prices' : 'Payment Information'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {openFaqModal === 'pricing' && (
              <>
                <p>Our pricing algorithm considers multiple factors to suggest fair rates:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Distance and estimated travel time</li>
                  <li>Current demand and supply in your area</li>
                  <li>Fuel costs and vehicle expenses</li>
                  <li>Popular routes and pricing trends</li>
                </ul>
                <p className="text-sm text-gray-500">
                  You can always adjust the suggested price. Lower prices typically result in faster bookings.
                </p>
              </>
            )}
            {openFaqModal === 'payment' && (
              <>
                <p>Here's how our payment system works:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payments are held for 48 hours after ride completion</li>
                  <li>Bank transfers: 1-5 business days</li>
                  <li>UPI/Digital wallets: Usually instant</li>
                  <li>We charge a small service fee (5-10%)</li>
                </ul>
                <p className="text-sm text-gray-500">
                  Contact support if you experience any payment delays.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Publish;
