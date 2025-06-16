
import express from 'express';
import { 
  getRides, 
  getRideById, 
  createRide, 
  updateRide, 
  bookRide, 
  cancelBooking, 
  searchRides 
} from '../controllers/rideController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Get all rides
router.get('/', getRides);

// Get ride by ID (must be before parameterized routes)
router.get('/:id', getRideById);

// Search for rides
router.get('/search/find', searchRides);

// Get location suggestions (mock data for now)
router.get('/locations/suggestions', async (req, res): Promise<void> => {
  try {
    const { query } = req.query;
    // Mock location suggestions - you can replace this with actual API integration
    const mockSuggestions = [
      { name: 'Mumbai Central', address: 'Mumbai Central, Mumbai, Maharashtra' },
      { name: 'Mumbai Airport', address: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai' },
      { name: 'Pune Station', address: 'Pune Railway Station, Pune, Maharashtra' },
      { name: 'Delhi Connaught Place', address: 'Connaught Place, New Delhi, Delhi' },
    ].filter(location => 
      !query || location.name.toLowerCase().includes((query as string).toLowerCase())
    );
    
    res.json(mockSuggestions);
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// Create a ride
router.post('/', protect, createRide);

// Update a ride
router.put('/:id', protect, updateRide);

// Book a ride
router.post('/:id/book', protect, bookRide);

// Cancel a booking
router.post('/:id/cancel', protect, cancelBooking);

export default router;
