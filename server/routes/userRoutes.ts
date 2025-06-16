
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  deleteUser 
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/profile/:id', getUserProfile);

// Update user profile
router.put('/profile/:id', protect, updateUserProfile);

// Change password
router.put('/change-password/:id', protect, changePassword);

// Delete user account
router.delete('/delete-account/:id', protect, deleteUser);

export default router;
