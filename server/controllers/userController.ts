
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    const id: string = (user._id as any).toString();
    const token = generateToken(id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const id: string = (user._id as any).toString();
    const token = generateToken(id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      rating: user.rating,
      isPhoneVerified: user.isPhoneVerified,
      isIDVerified: user.isIDVerified,
      token
    });
  } catch (error) {
    console.error('Error in user login:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, address, bio, isPhoneVerified, isIDVerified } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;
    if (typeof isPhoneVerified !== 'undefined') user.isPhoneVerified = isPhoneVerified;
    if (typeof isIDVerified !== 'undefined') user.isIDVerified = isIDVerified;
    
    const updatedUser = await user.save();
    
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      bio: updatedUser.bio,
      rating: updatedUser.rating,
      isPhoneVerified: updatedUser.isPhoneVerified,
      isIDVerified: updatedUser.isIDVerified
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password/:id
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/delete-account/:id
// @access  Private
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { currentPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};
