import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Users, Leaf, DollarSign, Lightbulb, Shield, UserCheck, Star, Car, MapPin } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  const [visibleSection, setVisibleSection] = useState('');
  const [counters, setCounters] = useState({ users: 0, rides: 0, cities: 0, savings: 0 });

  const handleStartJourney = () => {
    navigate('/publish');
  };

  const handleLearnMore = () => {
    navigate('/contact');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => observer.observe(section));

    // Animate counters
    const animateCounters = () => {
      const targets = { users: 15000, rides: 45000, cities: 120, savings: 2500000 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setCounters({
          users: Math.floor(targets.users * easeOutQuart),
          rides: Math.floor(targets.rides * easeOutQuart),
          cities: Math.floor(targets.cities * easeOutQuart),
          savings: Math.floor(targets.savings * easeOutQuart),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, increment);
    };

    const timer = setTimeout(animateCounters, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const stats = [
    { icon: Users, label: "Active Users", value: counters.users.toLocaleString(), suffix: "+" },
    { icon: Car, label: "Rides Completed", value: counters.rides.toLocaleString(), suffix: "+" },
    { icon: MapPin, label: "Cities Covered", value: counters.cities.toString(), suffix: "" },
    { icon: DollarSign, label: "Money Saved", value: `$${(counters.savings / 1000)}K`, suffix: "+" },
  ];

  const values = [
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of human connection and building a trusted community of travelers.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Leaf,
      title: "Sustainability", 
      description: "Every shared ride means fewer cars on the road, reducing carbon emissions and our environmental impact.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: DollarSign,
      title: "Affordability",
      description: "We're committed to making travel more affordable for everyone, with fair prices for both drivers and passengers.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We're constantly improving our platform to create the best possible experience for our users.",
      gradient: "from-pink-500 to-red-600"
    }
  ];

  const features = [
    { icon: Shield, title: "Advanced Safety", description: "Comprehensive verification and insurance coverage" },
    { icon: UserCheck, title: "Verified Profiles", description: "ID verification and rating system for trust" },
    { icon: Star, title: "Premium Experience", description: "Rated 4.8/5 by our community members" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none dark:bg-grid-slate-700"></div>
        <div className="container py-20 px-4 md:px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              About RideShare
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Revolutionizing transportation through community, sustainability, and innovation
            </p>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{animationDelay: `${0.4 + index * 0.1}s`}}
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-teal-600" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* Mission Section */}
          <section 
            id="mission" 
            className={`transition-all duration-1000 ${visibleSection === 'mission' ? 'animate-fade-in' : 'opacity-70'}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-8"></div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 md:p-12 rounded-3xl border border-teal-100 dark:border-gray-600 shadow-lg">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                At RideShare, we're committed to making transportation more affordable, 
                efficient, and social. By connecting drivers with empty seats to people 
                traveling the same way, we're building a community that reduces carbon 
                emissions, eases traffic congestion, and creates meaningful connections.
              </p>
            </div>
          </section>
          
          {/* Story Section */}
          <section 
            id="story"
            className={`transition-all duration-1000 ${visibleSection === 'story' ? 'animate-fade-in' : 'opacity-70'}`}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Started
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8 mx-auto"></div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                RideShare was founded in 2023 by a group of friends who were frustrated 
                with long commutes and high travel costs. What started as a simple idea 
                to share rides among friends has grown into a platform connecting thousands 
                of travelers across the country.
              </p>
            </div>
          </section>
          
          {/* Values Section */}
          <section 
            id="values"
            className={`transition-all duration-1000 ${visibleSection === 'values' ? 'animate-fade-in' : 'opacity-70'}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Our Values
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full mb-8"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 dark:border-gray-700"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.gradient} mb-6 shadow-lg`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Safety Section */}
          <section 
            id="safety"
            className={`transition-all duration-1000 ${visibleSection === 'safety' ? 'animate-fade-in' : 'opacity-70'}`}
          >
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-8 md:p-12 rounded-3xl border border-red-100 dark:border-gray-600">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Safety First
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-12 leading-relaxed">
                Your safety is our top priority. We've implemented comprehensive verification 
                processes, rating systems, and insurance coverage to ensure every ride is 
                safe and secure.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={feature.title}
                    className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section 
            id="join"
            className={`transition-all duration-1000 ${visibleSection === 'join' ? 'animate-fade-in' : 'opacity-70'}`}
          >
            <div className="text-center bg-gradient-to-br from-teal-600 to-blue-700 text-white p-12 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10 bg-cover bg-center"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
                <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mb-8"></div>
                <p className="text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
                  Whether you're looking to save on travel costs, reduce your carbon footprint, 
                  or simply meet interesting people along the way, RideShare is for you. 
                  Join our community today and be part of the future of transportation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleStartJourney}
                    className="bg-white text-teal-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Start Your Journey
                  </button>
                  <button 
                    onClick={handleLearnMore}
                    className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </Layout>
  );
}
