
import axios from 'axios';
import { Ride, User } from '../types';

// MongoDB API base URL - prioritize localhost for development
const API_BASE_URL = 'http://localhost:8080/api';

// Track connection status
let isConnected = false;

// Connection function to check if API is reachable
export async function connectToMongoDB() {
  try {
    console.log('Checking API connection at:', API_BASE_URL);
    // Check if API is reachable
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    });
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

// CRUD operations for Rides collection
export const RidesCollection = {
  // Get all rides
  getAllRides: async (): Promise<Ride[]> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/rides`);
        console.log('Fetched rides from API:', response.data.length);
        return response.data;
      }
      
      console.warn('API not connected, returning empty array');
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
      
      console.warn('API not connected');
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
        console.log('Creating ride via API:', rideData);
        const response = await axios.post(`${API_BASE_URL}/rides`, rideData);
        console.log('Ride created successfully:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot create ride');
      throw new Error('API not connected');
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  },
  
  // Update ride
  updateRide: async (id: string, rideData: Partial<Ride>): Promise<Ride | null> => {
    try {
      if (isConnected) {
        console.log('Updating ride via API:', id, rideData);
        const response = await axios.put(`${API_BASE_URL}/rides/${id}`, rideData);
        console.log('Ride updated successfully:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot update ride');
      throw new Error('API not connected');
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
        console.log('Ride deleted successfully:', id);
        return true;
      }
      
      console.warn('API not connected, cannot delete ride');
      throw new Error('API not connected');
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
        console.log('Search results from API:', response.data.length);
        return response.data;
      }
      
      console.warn('API not connected, returning empty search results');
      return [];
    } catch (error) {
      console.error('Error searching rides:', error);
      throw error;
    }
  },

  // Get location suggestions
  getLocationSuggestions: async (query: string): Promise<string[]> => {
    try {
      if (isConnected && query.length > 2) {
        const response = await axios.get(`${API_BASE_URL}/rides/locations/suggestions`, {
          params: { q: query }
        });
        return response.data;
      }
      
      // Fallback suggestions for common Indian locations
      const fallbackSuggestions = [
        'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 
        'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal',
        'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan',
        'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
        'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra',
        'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra',
        'Patna, Bihar', 'Vadodara, Gujarat', 'Ghaziabad, Uttar Pradesh',
        'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra',
        'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat',
        'Kalyan-Dombivali, Maharashtra', 'Vasai-Virar, Maharashtra', 'Varanasi, Uttar Pradesh',
        'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra', 'Dhanbad, Jharkhand',
        'Amritsar, Punjab', 'Navi Mumbai, Maharashtra', 'Allahabad, Uttar Pradesh',
        'Howrah, West Bengal', 'Gwalior, Madhya Pradesh', 'Jabalpur, Madhya Pradesh',
        'Coimbatore, Tamil Nadu', 'Vijayawada, Andhra Pradesh', 'Jodhpur, Rajasthan',
        'Madurai, Tamil Nadu', 'Raipur, Chhattisgarh', 'Kota, Rajasthan',
        'Chandigarh, Chandigarh', 'Guwahati, Assam', 'Solapur, Maharashtra',
        'Hubli-Dharwad, Karnataka', 'Tiruchirappalli, Tamil Nadu', 'Bareilly, Uttar Pradesh',
        'Mysore, Karnataka', 'Tiruppur, Tamil Nadu', 'Gurgaon, Haryana',
        'Aligarh, Uttar Pradesh', 'Jalandhar, Punjab', 'Bhubaneswar, Odisha',
        'Salem, Tamil Nadu', 'Warangal, Telangana', 'Guntur, Andhra Pradesh',
        'Bhiwandi, Maharashtra', 'Saharanpur, Uttar Pradesh', 'Gorakhpur, Uttar Pradesh',
        'Bikaner, Rajasthan', 'Amravati, Maharashtra', 'Noida, Uttar Pradesh',
        'Jamshedpur, Jharkhand', 'Bhilai, Chhattisgarh', 'Cuttack, Odisha',
        'Firozabad, Uttar Pradesh', 'Kochi, Kerala', 'Bhavnagar, Gujarat',
        'Dehradun, Uttarakhand', 'Durgapur, West Bengal', 'Asansol, West Bengal',
        'Nanded, Maharashtra', 'Kolhapur, Maharashtra', 'Ajmer, Rajasthan',
        'Gulbarga, Karnataka', 'Jamnagar, Gujarat', 'Ujjain, Madhya Pradesh',
        'Loni, Uttar Pradesh', 'Siliguri, West Bengal', 'Jhansi, Uttar Pradesh',
        'Ulhasnagar, Maharashtra', 'Nellore, Andhra Pradesh', 'Jammu, Jammu and Kashmir',
        'Sangli-Miraj & Kupwad, Maharashtra', 'Belgaum, Karnataka', 'Mangalore, Karnataka',
        'Ambattur, Tamil Nadu', 'Tirunelveli, Tamil Nadu', 'Malegaon, Maharashtra',
        'Gaya, Bihar', 'Jalgaon, Maharashtra', 'Udaipur, Rajasthan',
        'Maheshtala, West Bengal', 'Kadapa, Andhra Pradesh', 'Kurnool, Andhra Pradesh'
      ];
      
      return fallbackSuggestions.filter(location =>
        location.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
    } catch (error) {
      console.error('Error getting location suggestions:', error);
      return [];
    }
  }
};

// CRUD operations for Users collection
export const UsersCollection = {
  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/users/profile/${id}`);
        return response.data;
      }
      
      console.warn('API not connected');
      return null;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      throw error;
    }
  },
  
  // Login user
  loginUser: async (email: string, password: string): Promise<User> => {
    try {
      if (isConnected) {
        console.log('Attempting login via API for:', email);
        const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
        console.log('Login successful:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot login');
      throw new Error('API not connected');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  
  // Register user
  registerUser: async (userData: Partial<User> & { password: string }): Promise<User> => {
    try {
      if (isConnected) {
        console.log('Attempting registration via API:', userData.email);
        const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
        console.log('Registration successful:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot register');
      throw new Error('API not connected');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      if (isConnected) {
        console.log('Updating profile via API:', id, userData);
        const response = await axios.put(`${API_BASE_URL}/users/profile/${id}`, userData);
        console.log('Profile updated successfully:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot update profile');
      throw new Error('API not connected');
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (isConnected) {
        console.log('Changing password via API for user:', userId);
        await axios.put(`${API_BASE_URL}/users/change-password/${userId}`, {
          currentPassword,
          newPassword
        });
        console.log('Password changed successfully');
        return true;
      }
      
      console.warn('API not connected, cannot change password');
      throw new Error('API not connected');
    } catch (error) {
      console.error(`Error changing password for user ${userId}:`, error);
      throw error;
    }
  }
};

// CRUD operations for Ratings collection
export const RatingsCollection = {
  // Get ratings for a user
  getUserRatings: async (userId: string) => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/ratings/user/${userId}`);
        return response.data;
      }
      
      console.warn('API not connected');
      return [];
    } catch (error) {
      console.error(`Error getting ratings for user ${userId}:`, error);
      throw error;
    }
  },

  // Get average rating for a user
  getUserAverageRating: async (userId: string) => {
    try {
      if (isConnected) {
        const response = await axios.get(`${API_BASE_URL}/ratings/average/${userId}`);
        return response.data;
      }
      
      console.warn('API not connected');
      return { average: 0, count: 0 };
    } catch (error) {
      console.error(`Error getting average rating for user ${userId}:`, error);
      throw error;
    }
  },

  // Create a rating
  createRating: async (ratingData: any) => {
    try {
      if (isConnected) {
        console.log('Creating rating via API:', ratingData);
        const response = await axios.post(`${API_BASE_URL}/ratings`, ratingData);
        console.log('Rating created successfully:', response.data);
        return response.data;
      }
      
      console.warn('API not connected, cannot create rating');
      throw new Error('API not connected');
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  }
};

// Make initial connection check when module is imported
connectToMongoDB().catch(console.error);
