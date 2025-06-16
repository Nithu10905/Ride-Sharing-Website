
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/features/SearchBar';
import TestimonialCarousel from '@/components/features/TestimonialCarousel';
import { Button } from '@/components/ui/button';
import { CarFront, MapPin, Clock, Users, Star, Shield, Globe, Zap, ArrowRight, Heart, TrendingUp, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/publish');
  };

  const handleDestinationClick = (from: string, to: string) => {
    const searchParams = new URLSearchParams({
      from: from,
      to: to,
      date: new Date().toISOString().split('T')[0]
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleViewAllDestinations = () => {
    navigate('/search');
  };
  
  return (
    <Layout>
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#7c3aed] text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Zap className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm font-semibold">Sustainable Transportation Solution</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Your pick of rides at{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                low prices
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100/90 max-w-4xl mx-auto leading-relaxed font-medium">
              Connect with verified drivers and fellow travelers for safe, affordable, and eco-friendly journeys across the country.
            </p>
          </div>
          
          {/* Enhanced Search Bar Section */}
          <div className="flex flex-col items-center">
            <div className="max-w-6xl w-full mx-auto mb-12">
              <SearchBar variant="homepage" />
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-blue-100 mt-6">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <span className="text-lg font-bold">A</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <span className="text-lg font-bold">B</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <span className="text-lg font-bold">C</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="text-xl font-bold tracking-wide">50,000+ happy travelers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-6 py-3 mb-6">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Trusted Platform</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why choose RideShare?</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the future of transportation with our innovative carpooling platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {/* Feature Card 1 */}
            <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Affordable Rides Everywhere</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Find the perfect ride from our wide network of destinations at unbeatable prices. Save up to 70% compared to traditional transport.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Verified routes</span>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Long Distance Made Easy</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Travel comfortably across cities and states with verified drivers and safe, reliable transportation options.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <Shield className="w-5 h-5 mr-2" />
                <span>Safety guaranteed</span>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Book your ride in seconds with our streamlined app. Real-time updates and instant confirmations included.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <Clock className="w-5 h-5 mr-2" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <TestimonialCarousel />

      {/* Enhanced How It Works Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Simple Process</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How RideShare Works</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get started in minutes with our simple four-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Enhanced Steps */}
            <div className="space-y-12">
              {[
                {
                  number: 1,
                  title: "Search for a ride",
                  description: "Enter your destination and travel date to find available rides from people heading the same way.",
                  gradient: "from-blue-500 to-blue-600",
                  icon: MapPin
                },
                {
                  number: 2,
                  title: "Book a seat",
                  description: "Choose a ride that fits your schedule and budget. Book your seat with just a few clicks.",
                  gradient: "from-green-500 to-green-600",
                  icon: CheckCircle
                },
                {
                  number: 3,
                  title: "Connect with driver",
                  description: "Get driver details and contact information. Coordinate pickup location and time.",
                  gradient: "from-purple-500 to-purple-600",
                  icon: Users
                },
                {
                  number: 4,
                  title: "Enjoy the journey",
                  description: "Meet your driver and fellow passengers. Share costs, make connections, and travel safely.",
                  gradient: "from-orange-500 to-orange-600",
                  icon: Heart
                }
              ].map((step, index) => (
                <div key={step.number} className="flex items-start space-x-6 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center mb-4">
                      <step.icon className="w-6 h-6 mr-3 text-gray-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Phone Mockup */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-[500px] bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-[3rem] p-8 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-[2rem] h-full flex flex-col relative overflow-hidden">
                    {/* Phone header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-white text-xl font-bold">RideShare</h3>
                        <p className="text-blue-100 text-sm">Find your perfect ride</p>
                      </div>
                    </div>
                    
                    {/* Phone content */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                        <CarFront className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Ready to go?</h4>
                      <p className="text-gray-600 text-center text-sm leading-relaxed mb-6">
                        Find rides, connect with drivers, and travel sustainably
                      </p>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Popular Destinations */}
      <div className="bg-gradient-to-br from-[#074452] to-[#0a5568] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-300" />
                  Popular destinations
                </h2>
                <p className="text-xl text-[#b3e3ff] mt-3">Discover the most traveled routes on our platform</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-blue-300">
                <span className="text-sm">More routes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { from: 'New Delhi', to: 'Chandigarh', price: '₹450', badge: 'Most Popular' },
              { from: 'New Delhi', to: 'Jaipur', price: '₹380', badge: 'Frequent' },
              { from: 'New Delhi', to: 'Agra', price: '₹320', badge: 'Quick Trip' }
            ].map((route, index) => (
              <button
                key={index}
                onClick={() => handleDestinationClick(route.from, route.to)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-bold text-[#093c49] text-lg">{route.from}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#093c49] text-lg">{route.to}</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {route.badge}
                  </span>
                  <span className="text-xl font-bold text-green-600">{route.price}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleViewAllDestinations}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-3 border border-white/20"
            >
              See all popular rides
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Left side */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-[3rem] p-12 text-center shadow-2xl border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Join the Movement</h3>
                <p className="text-blue-100 text-xl mb-6">50,000+ travelers trust us</p>
                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-200 text-sm">4.9/5 average rating</p>
              </div>
            </div>
            
            {/* Enhanced Right side */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Globe className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-sm font-semibold">Eco-Friendly Travel</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Make your journey{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  smart & sustainable
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Connect with fellow travelers, reduce your carbon footprint, and save money while exploring new destinations together.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">70%</div>
                  <div className="text-blue-200">Cost savings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-green-300 mb-2">50%</div>
                  <div className="text-blue-200">CO₂ reduction</div>
                </div>
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-white text-blue-700 hover:bg-blue-50 px-12 py-6 rounded-2xl text-xl font-bold flex items-center gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <CarFront className="h-7 w-7 group-hover:scale-110 transition-transform" />
                Start your journey
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Join our growing community</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of travelers nationwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text mb-4">25K+</p>
                <p className="text-gray-600 text-xl font-medium">Active users</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CarFront className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text mb-4">100K+</p>
                <p className="text-gray-600 text-xl font-medium">Rides completed</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text mb-4">40+</p>
                <p className="text-gray-600 text-xl font-medium">Cities covered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
