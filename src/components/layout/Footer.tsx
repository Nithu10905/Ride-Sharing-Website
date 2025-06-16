
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/rideshare',
      twitter: 'https://twitter.com/rideshare',
      instagram: 'https://instagram.com/rideshare',
      linkedin: 'https://linkedin.com/company/rideshare'
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:support@rideshare.example');
  };

  const handlePhoneClick = () => {
    window.open('tel:+15551234567');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">RideShare</h3>
            <p className="text-gray-300">
              Connecting people through safe, affordable, and eco-friendly ride sharing.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('facebook')}
                className="text-white hover:text-blue-400 hover:bg-gray-800"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('twitter')}
                className="text-white hover:text-blue-400 hover:bg-gray-800"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('instagram')}
                className="text-white hover:text-pink-400 hover:bg-gray-800"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('linkedin')}
                className="text-white hover:text-blue-400 hover:bg-gray-800"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/search" className="block text-gray-300 hover:text-white transition-colors">
                Search Rides
              </Link>
              <Link to="/publish" className="block text-gray-300 hover:text-white transition-colors">
                Publish a Ride
              </Link>
              <Link to="/your-rides" className="block text-gray-300 hover:text-white transition-colors">
                Your Rides
              </Link>
              <Link to="/inbox" className="block text-gray-300 hover:text-white transition-colors">
                Messages
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Safety Guidelines
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={handleEmailClick}
                className="flex items-center space-x-2 text-gray-300 hover:text-white p-0 h-auto justify-start"
              >
                <Mail className="w-4 h-4" />
                <span>support@rideshare.example</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handlePhoneClick}
                className="flex items-center space-x-2 text-gray-300 hover:text-white p-0 h-auto justify-start"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </Button>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>123 Rideshare St, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RideShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
