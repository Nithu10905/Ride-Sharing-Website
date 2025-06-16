
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Ride, { IRide } from '../models/Ride';

// @desc    Get all rides
// @route   GET /api/rides
// @access  Public
export const getRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'name email rating')
      .populate('passengers', 'name email');
    
    res.json(rides);
  } catch (error) {
    console.error('Error getting rides:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Get a specific ride by ID
// @route   GET /api/rides/:id
// @access  Public
export const getRideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email rating')
      .populate('passengers', 'name email');
    
    if (!ride) {
      res.status(404).json({ message: 'Ride not found' });
      return;
    }
    
    res.json(ride);
  } catch (error) {
    console.error('Error getting ride:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
export const createRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      driver, from, to, departureTime, arrivalTime, 
      price, availableSeats, vehicle, instantBooking 
    } = req.body;
    
    const ride = new Ride({
      driver,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      vehicle,
      instantBooking,
      passengers: [],
      status: 'active'
    });
    
    const newRide = await ride.save();
    res.status(201).json(newRide);
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Update a ride
// @route   PUT /api/rides/:id
// @access  Private
export const updateRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({ message: 'Ride not found' });
      return;
    }
    
    // Update ride fields
    Object.assign(ride, req.body);
    
    const updatedRide = await ride.save();
    res.json(updatedRide);
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Book a ride (add passenger)
// @route   POST /api/rides/:id/book
// @access  Private
export const bookRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({ message: 'Ride not found' });
      return;
    }
    
    if (ride.availableSeats <= 0) {
      res.status(400).json({ message: 'No seats available' });
      return;
    }
    
    // Add passenger to ride
    ride.passengers.push(new mongoose.Types.ObjectId(userId));
    ride.availableSeats -= 1;
    
    const updatedRide = await ride.save();
    res.json(updatedRide);
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Cancel a booking
// @route   POST /api/rides/:id/cancel
// @access  Private
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, reason } = req.body;
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({ message: 'Ride not found' });
      return;
    }
    
    // Remove passenger from ride
    ride.passengers = ride.passengers.filter(
      (passenger: any) => passenger.toString() !== userId
    );
    ride.availableSeats += 1;
    
    if ((ride.driver as any).toString() === userId) {
      // If driver cancels, mark ride as cancelled
      ride.status = 'cancelled';
      ride.cancelReason = reason;
    }
    
    const updatedRide = await ride.save();
    res.json(updatedRide);
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};

// @desc    Search for rides
// @route   GET /api/rides/search/find
// @access  Public
export const searchRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;
    
    const rides = await Ride.find({
      'from.name': { $regex: from, $options: 'i' },
      'to.name': { $regex: to, $options: 'i' },
      status: 'active',
      availableSeats: { $gt: 0 }
    })
      .populate('driver', 'name email rating')
      .sort('departureTime');
    
    res.json(rides);
  } catch (error) {
    console.error('Error searching rides:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
};
