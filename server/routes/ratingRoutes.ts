
import express from 'express';
import Rating from '../models/Rating';
import { protect } from '../middleware/authMiddleware';
import { RequestWithUser } from '../utils/jwt';

const router = express.Router();

// Get ratings for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ ratee: userId })
      .populate('rater', 'name')
      .populate('ride', 'from to')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

// Get average rating for a user
router.get('/average/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Rating.aggregate([
      { $match: { ratee: userId } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    const average = result.length > 0 ? result[0].average : 0;
    const count = result.length > 0 ? result[0].count : 0;
    
    res.json({ average: Math.round(average * 10) / 10, count });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Error calculating average rating' });
  }
});

// Create a new rating
router.post('/', protect, async (req, res): Promise<void> => {
  try {
    const { rateeId, rideId, rating, comment, type } = req.body;
    const raterId = (req as RequestWithUser).user!.id;

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      rater: raterId,
      ratee: rateeId,
      ride: rideId
    });

    if (existingRating) {
      res.status(400).json({ message: 'Rating already exists for this ride' });
      return;
    }

    const newRating = new Rating({
      rater: raterId,
      ratee: rateeId,
      ride: rideId,
      rating,
      comment,
      type
    });

    await newRating.save();
    
    const populatedRating = await Rating.findById(newRating._id)
      .populate('rater', 'name')
      .populate('ratee', 'name')
      .populate('ride', 'from to');

    res.status(201).json(populatedRating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Error creating rating' });
  }
});

// Update a rating
router.put('/:id', protect, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as RequestWithUser).user!.id;

    const existingRating = await Rating.findOne({ _id: id, rater: userId });
    
    if (!existingRating) {
      res.status(404).json({ message: 'Rating not found or unauthorized' });
      return;
    }

    existingRating.rating = rating;
    if (comment !== undefined) {
      existingRating.comment = comment;
    }

    await existingRating.save();
    
    const populatedRating = await Rating.findById(existingRating._id)
      .populate('rater', 'name')
      .populate('ratee', 'name')
      .populate('ride', 'from to');

    res.json(populatedRating);
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Error updating rating' });
  }
});

// Delete a rating
router.delete('/:id', protect, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as RequestWithUser).user!.id;

    const rating = await Rating.findOneAndDelete({ _id: id, rater: userId });
    
    if (!rating) {
      res.status(404).json({ message: 'Rating not found or unauthorized' });
      return;
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
});

export default router;
