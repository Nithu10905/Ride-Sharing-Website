// This file handles MongoDB connection for the frontend
import { Ride, User } from '../types';
import axios from 'axios';

// MongoDB API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Track connection status
let isConnected = false;

// Example connection function (now just checks if the API is reachable)
export async function connectToMongoDB() {
  try {
    console.log('Checking API connection...');
    // Check if API is reachable
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('API connection status:', response.data);
    isConnected = response.data.status === 'ok';
    return isConnected;
  } catch (error) {
    console.error('Failed to connect to API:', error);
    isConnected = false;
    console.warn('API not available, falling back to local storage');
    return false;
  }
}

// Check connection status
export function isMongoDBConnected() {
  return isConnected;
}

// Get location recommendations based on user input
export const getLocationRecommendations = async (query: string): Promise<string[]> => {
  try {
    if (isConnected) {
      const response = await axios.get(`${API_BASE_URL}/locations/recommendations`, {
        params: { q: query }
      });
      return response.data;
    }
    
    // Fallback to local recommendations
    const popularLocations = [
      'Mumbai, Maharashtra',
      'Delhi, India',
      'Bangalore, Karnataka',
      'Chennai, Tamil Nadu',
      'Kolkata, West Bengal',
      'Hyderabad, Telangana',
      'Pune, Maharashtra',
      'Ahmedabad, Gujarat',
      'Chandigarh, Punjab',
      'Jaipur, Rajasthan',
      'Kochi, Kerala',
      'Goa, India',
      'Agra, Uttar Pradesh',
      'Lucknow, Uttar Pradesh',
      'Nagpur, Maharashtra',
      'Indore, Madhya Pradesh',
      'Bhopal, Madhya Pradesh',
      'Visakhapatnam, Andhra Pradesh',
      'Vadodara, Gujarat',
      'Ludhiana, Punjab'
    ];
    
    return popularLocations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  } catch (error) {
    console.error('Error getting location recommendations:', error);
    return [];
  }
};

// Example CRUD operations for Rides collection - now using API
export const RidesCollection = {
  // Get all rides
  getAllRides: async (): Promise<Ride[]> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides`);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return [];
    } catch (error) {
      console.error('Error getting rides:', error);
      throw error;
    }
  },
  
  // Get ride by ID
  getRideById: async (id: string): Promise<Ride | null> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides/${id}`);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return null;
    } catch (error) {
      console.error(`Error getting ride ${id}:`, error);
      throw error;
    }
  },
  
  // Create new ride
  createRide: async (rideData: Ride): Promise<Ride> => {
    try {
      if (isConnected) {
        const response = await axios.post(`${API_BASE_URL}/rides`, rideData);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return { ...rideData, id: `local-${Date.now()}` };
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  },
  
  // Update ride
  updateRide: async (id: string, rideData: Partial<Ride>): Promise<Ride | null> => {
    try {
      if (isConnected) {
        const response = await axios.put(`${API_BASE_URL}/rides/${id}`, rideData);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return { ...(rideData as Ride), id };
    } catch (error) {
      console.error(`Error updating ride ${id}:`, error);
      throw error;
    }
  },
  
  // Delete ride
  deleteRide: async (id: string): Promise<boolean> => {
    try {
      if (isConnected) {
        await axios.delete(`${API_BASE_URL}/rides/${id}`);
        return true;
      }
      
      console.warn('API not connected, falling back to local storage');
      return true;
    } catch (error) {
      console.error(`Error deleting ride ${id}:`, error);
      throw error;
    }
  },
  
  // Search rides
  searchRides: async (from: string, to: string): Promise<Ride[]> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides/search/find`, {
          params: { from, to }
        });
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return [];
    } catch (error) {
      console.error('Error searching rides:', error);
      throw error;
    }
  },
  
  // Get popular routes
  getPopularRoutes: async (): Promise<Array<{from: string, to: string, count: number}>> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides/popular-routes`);
        return response.data;
      }
      
      // Fallback to mock data
      return [
        { from: 'Mumbai', to: 'Pune', count: 45 },
        { from: 'Delhi', to: 'Chandigarh', count: 38 },
        { from: 'Bangalore', to: 'Chennai', count: 32 },
        { from: 'Hyderabad', to: 'Vijayawada', count: 28 },
        { from: 'Ahmedabad', to: 'Vadodara', count: 25 }
      ];
    } catch (error) {
      console.error('Error getting popular routes:', error);
      return [];
    }
  },
  
  // Get rides by location
  getRidesByLocation: async (location: string): Promise<Ride[]> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides/by-location`, {
          params: { location }
        });
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return [];
    } catch (error) {
      console.error('Error getting rides by location:', error);
      return [];
    }
  }
};

// Example CRUD operations for Users collection - now using API
export const UsersCollection = {
  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/users/profile/${id}`);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return null;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      throw error;
    }
  },
  
  // Get user by email
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      if (isConnected) {
        // This would need an endpoint on your API
        const response = await axios.get(`${API_BASE_URL}/users/email/${email}`);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return null;
    } catch (error) {
      console.error(`Error getting user with email ${email}:`, error);
      throw error;
    }
  },
  
  // Create new user
  createUser: async (userData: User): Promise<User> => {
    try {
      if (isConnected) {
        const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return { ...userData, id: `local-${Date.now()}` };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      if (isConnected) {
        const response = await axios.put(`${API_BASE_URL}/users/profile/${id}`, userData);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return { ...(userData as User), id };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  // Verify password
  verifyPassword: async (email: string, password: string): Promise<boolean> => {
    try {
      if (isConnected) {
        try {
          await axios.post(`${API_BASE_URL}/users/login`, { email, password });
          return true;
        } catch {
          return false;
        }
      }
      
      console.warn('API not connected, falling back to local storage');
      return true; // For demo, accept any password
    } catch (error) {
      console.error(`Error verifying password for user ${email}:`, error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (userId: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (isConnected) {
        await axios.put(`${API_BASE_URL}/users/change-password/${userId}`, {
          currentPassword: oldPassword, 
          newPassword
        });
        return true;
      }
      
      console.warn('API not connected, falling back to local storage');
      return true; // For demo, accept any password change
    } catch (error) {
      console.error(`Error changing password for user ${userId}:`, error);
      throw error;
    }
  }
};

// CRUD operations for Ratings collection
export const RatingsCollection = {
  // Get ratings for a user
  getUserRatings: async (userId: string): Promise<any[]> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/ratings/user/${userId}`);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return [];
    } catch (error) {
      console.error(`Error getting ratings for user ${userId}:`, error);
      throw error;
    }
  },

  // Create a new rating
  createRating: async (ratingData: {
    raterId: string;
    rateeId: string;
    rideId: string;
    rating: number;
    comment?: string;
    type: 'driver' | 'passenger';
  }): Promise<any> => {
    try {
      if (isConnected) {
        const response = await axios.post(`${API_BASE_URL}/ratings`, ratingData);
        return response.data;
      }
      
      console.warn('API not connected, falling back to local storage');
      return { ...ratingData, id: `local-${Date.now()}` };
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  },

  // Get average rating for a user
  getUserAverageRating: async (userId: string): Promise<number> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/ratings/average/${userId}`);
        return response.data.average || 0;
      }
      
      console.warn('API not connected, falling back to local storage');
      return 4.5; // Default rating for demo
    } catch (error) {
      console.error(`Error getting average rating for user ${userId}:`, error);
      throw error;
    }
  }
};

// Make initial connection check
connectToMongoDB().catch(console.error);
