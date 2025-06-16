
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IRide } from './Ride';

export interface IRating extends Document {
  rater: IUser['_id'];
  ratee: IUser['_id'];
  ride: IRide['_id'];
  rating: number;
  comment?: string;
  type: 'driver' | 'passenger';
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema: Schema = new Schema({
  rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  type: { type: String, enum: ['driver', 'passenger'], required: true }
}, {
  timestamps: true
});

// Prevent duplicate ratings for the same ride and users
RatingSchema.index({ rater: 1, ratee: 1, ride: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);
