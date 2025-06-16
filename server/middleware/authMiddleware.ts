
import { Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, RequestWithUser } from '../utils/jwt';
import User from '../models/User';

// Authentication middleware
export const protect: RequestHandler = async (req, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
        return;
      }
      
      // Fetch the user from the database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      
      // Cast req as RequestWithUser for setting .user
      (req as RequestWithUser).user = user;
      next();
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Admin middleware
export const admin: RequestHandler = (req, res: Response, next: NextFunction): void => {
  // Cast req as RequestWithUser for reading .user
  if ((req as RequestWithUser).user && (req as RequestWithUser).user!.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
