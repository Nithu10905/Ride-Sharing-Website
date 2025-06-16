
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { UsersCollection } from '../api/mongodb';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for persisting login state
const USER_STORAGE_KEY = 'rideshare_user';
const TOKEN_STORAGE_KEY = 'rideshare_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('🔐 Restored user session:', userData.email);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', email);
      
      // Try to authenticate with our MongoDB API
      const response = await UsersCollection.loginUser(email, password);
      
      // Set the user data and token
      const userData = {
        id: response._id || response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: response.address,
        bio: response.bio,
        rating: response.rating
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store user data and token in localStorage for session persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      if (response.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      }
      
      console.log('✅ Login successful for:', email);
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Login failed:", error);
      return Promise.reject("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration for:', email);
      
      // Try to register with our MongoDB API
      const response = await UsersCollection.registerUser({ name, email, password });
      
      // Set the user data and token
      const userData = {
        id: response._id || response.id,
        name: response.name,
        email: response.email
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store user data and token in localStorage for session persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      if (response.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      }
      
      console.log('✅ Registration successful for:', email);
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      return Promise.reject("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      console.log('🔄 Updating profile for user:', user.id);
      
      // Try to update user profile with our MongoDB API
      const response = await UsersCollection.updateProfile(user.id, userData);
      
      if (response) {
        // Update the user state with the new data
        const updatedUser = { ...user, ...response };
        setUser(updatedUser);
        
        // Store updated user data in localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        console.log('✅ Profile updated successfully');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      return Promise.reject("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      console.log('🔒 Changing password for user:', user.id);
      
      // Try to change password with our MongoDB API
      const success = await UsersCollection.changePassword(user.id, currentPassword, newPassword);
      
      if (success) {
        console.log('✅ Password changed successfully');
      }
      
      return success;
    } catch (error) {
      console.error("❌ Password change failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        register,
        logout, 
        updateUserProfile, 
        changePassword,
        loading 
      }}
    >
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
