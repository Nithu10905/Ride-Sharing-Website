
import express from 'express';
import { protect } from '../middleware/authMiddleware';
import Message from '../models/Message';
import { IMessage } from '../models/Message';
import { Request, Response } from 'express';

const router = express.Router();

// Get all messages for a user
router.get('/user/:userId', protect, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages for user:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// Get conversation between two users
router.get('/conversation/:user1Id/:user2Id', protect, async (req: Request, res: Response) => {
  try {
    const user1Id = req.params.user1Id;
    const user2Id = req.params.user2Id;
    const messages = await Message.find({
      $or: [
        { sender: user1Id, recipient: user2Id },
        { sender: user2Id, recipient: user1Id }
      ]
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// Send a message
router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender, recipient, content, rideId } = req.body;

    const newMessage = new Message({
      sender,
      recipient,
      content,
      rideId
    });

    const savedMessage = await newMessage.save();

    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    if (!populatedMessage) {
      res.status(500).json({ message: 'Failed to populate message' });
      return;
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// Mark messages as read
router.put('/read/:userId/:otherUserId', protect, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const otherUserId = req.params.otherUserId;

    // Find and update messages where recipient is userId and sender is otherUserId
    const result = await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: `${result.modifiedCount} messages marked as read` });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

export default router;
