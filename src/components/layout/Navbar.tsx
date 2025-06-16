import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, Car, MessageSquare, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary dark:text-blue-400 hover:text-primary/80 transition-colors">
            RideShare
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => handleNavigation('/search')} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              <Search className="w-4 h-4" />
              Search Rides
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/publish')} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              <Car className="w-4 h-4" />
              Publish a Ride
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/about')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              About
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/contact')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              Contact
            </Button>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    <div className="w-8 h-8 bg-primary dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" align="end">
                  <DropdownMenuItem onClick={() => handleNavigation('/profile')} className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/your-rides')} className="flex items-center gap-2 cursor-pointer">
                    <Car className="w-4 h-4" />
                    Your Rides
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/inbox')} className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    Inbox
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/publish')} className="flex items-center gap-2 cursor-pointer">
                    <Car className="w-4 h-4" />
                    Publish a Ride
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => handleNavigation('/login')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  Login
                </Button>
                <Button onClick={() => handleNavigation('/register')} className="bg-primary dark:bg-blue-500 hover:bg-primary/90 dark:hover:bg-blue-600">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleMobileMenuToggle}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" onClick={() => handleNavigation('/search')} className="w-full justify-start flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              <Search className="w-4 h-4" />
              Search Rides
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/publish')} className="w-full justify-start flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              <Car className="w-4 h-4" />
              Publish a Ride
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/about')} className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              About
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/contact')} className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              Contact
            </Button>

            {user ? (
              <>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-2 mb-2">
                    <div className="w-8 h-8 bg-primary dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => handleNavigation('/profile')} className="w-full justify-start flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
                <Button variant="ghost" onClick={() => handleNavigation('/your-rides')} className="w-full justify-start flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Your Rides
                </Button>
                <Button variant="ghost" onClick={() => handleNavigation('/inbox')} className="w-full justify-start flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Inbox
                </Button>
                <Button variant="outline" onClick={handleLogout} className="w-full justify-start flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation('/login')} className="w-full justify-start">
                  Login
                </Button>
                <Button onClick={() => handleNavigation('/register')} className="w-full justify-start">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
