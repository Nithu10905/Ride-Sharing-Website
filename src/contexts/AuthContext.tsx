
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for persisting login state
const USER_STORAGE_KEY = 'rideshare_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call to your MongoDB backend
      console.log("Attempting login with", email);
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      // For demo purposes, we'll create a mock user
      // In production, this should validate against your MongoDB users collection
      const userData: User = {
        id: "user-1",
        name: email.split('@')[0],
        email: email
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store user data in localStorage for session persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Login failed:", error);
      return Promise.reject("Login failed");
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      // In a real app, this would be an API call to your MongoDB backend
      console.log("Updating user profile:", userData);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the user state with the new data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Store updated user data in localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Profile update failed:", error);
      return Promise.reject("Profile update failed");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
