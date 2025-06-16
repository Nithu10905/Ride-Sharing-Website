
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IMessage extends Document {
  sender: IUser['_id'];
  recipient: IUser['_id'];
  content: string;
  rideId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rideId: { type: Schema.Types.ObjectId, ref: 'Ride' },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IMessage>('Message', MessageSchema);
