
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/features/SearchBar";
import TestimonialCarousel from "@/components/features/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Clean Search Bar */}
      <section className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C200,250 400,350 600,300 C800,250 1000,350 1200,300 L1200,600 L0,600 Z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Your pick of rides at low prices
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Find rides to anywhere with RideShare, your sustainable and affordable transportation solution.
            </p>
          </div>
          
          {/* Clean Search Bar */}
          <div className="max-w-5xl mx-auto">
            <SearchBar variant="homepage" />
          </div>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-100">Join <span className="font-bold">50,000+</span> happy travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose RideShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of transportation with our innovative carpooling platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Your pick of rides at low prices</h3>
              <p className="text-gray-600">
                No matter where you're going, find the perfect ride from our wide range of destinations and routes at unbeatable prices.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Long distance made easy</h3>
              <p className="text-gray-600">
                Travel comfortably across cities and states with verified drivers and safe, reliable transportation options.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Book in seconds</h3>
              <p className="text-gray-600">
                Booking a ride has never been easier! Thanks to our simple app, you can book a ride close to you in just minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-primary">RideShare</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RideShare connects riders with like-minded commuters; you don't have to stress yourself as we are always ready to go near or far with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Search for a ride</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Enter your destination and travel dates to find available rides from people heading your way.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Book a seat</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choose a ride that fits your schedule and book your seat with just a few clicks.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Confirm meeting point</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Chat with the driver to confirm pickup location and any other details about your journey.
                  </p>
                </div>
                </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Enjoy the ride</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Meet your driver and fellow passengers, share the journey, and arrive at your destination safely.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto w-[300px] h-[600px] border-8 border-gray-900 rounded-[40px] overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-lg font-medium">RideShare App</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most traveled routes on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/search?from=Punjab&to=Delhi"
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex justify-between items-center hover:shadow-lg hover:border-primary transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Punjab</span>
                  <p className="text-sm text-gray-500">Starting from ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">D</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-gray-900">Delhi</span>
                <p className="text-sm text-gray-500">Popular route</p>
              </div>
            </Link>
            
            <Link
              to="/search?from=Mumbai&to=Chandigarh"
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex justify-between items-center hover:shadow-lg hover:border-primary transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">M</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Mumbai</span>
                  <p className="text-sm text-gray-500">Starting from ₹800</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">C</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-gray-900">Chandigarh</span>
                <p className="text-sm text-gray-500">Trending</p>
              </div>
            </Link>
            
            <Link
              to="/search?from=Bombay&to=Goa"
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex justify-between items-center hover:shadow-lg hover:border-primary transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">B</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Bombay</span>
                  <p className="text-sm text-gray-500">Starting from ₹600</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">G</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-gray-900">Goa</span>
                <p className="text-sm text-gray-500">Weekend special</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-xl font-medium">Happy travelers</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 text-white">
              <div className="text-sm font-medium bg-white/20 rounded-full px-4 py-2 inline-block">
                🌱 Ride with Purpose
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Make your everyday life <span className="text-yellow-300">smart & sustainable</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Effortlessly find and connect with fellow commuters who have similar routes or destinations. Whether it's commuting to work, attending events, or running errands.
              </p>
              <p className="text-blue-100">
                This platform brings together a community of travelers with a common goal: to share rides and reduce traffic congestion, while enjoying the journey.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
