
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  bio?: string;
  rating?: number;
  isAdmin?: boolean;
  isPhoneVerified?: boolean;
  isIDVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIDVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
