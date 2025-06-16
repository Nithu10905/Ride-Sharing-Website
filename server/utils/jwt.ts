
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Create and sign a JWT token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Express middleware interfaces
export interface RequestWithUser extends Request {
  user?: IUser;
}
