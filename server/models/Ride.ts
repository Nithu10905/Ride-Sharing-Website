
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ILocation {
  name: string;
  address: string;
}

export interface IVehicle {
  make: string;
  model: string;
  color: string;
}

export interface IRide extends Document {
  driver: IUser['_id'];
  from: ILocation;
  to: ILocation;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  vehicle?: IVehicle;
  passengers: IUser['_id'][];
  instantBooking?: boolean;
  status: 'active' | 'completed' | 'cancelled';
  cancelReason?: string;
  paymentType?: 'cash' | 'upi' | 'card' | 'online';
  createdAt: Date;
  updatedAt: Date;
}

const RideSchema: Schema = new Schema({
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  from: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  to: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  vehicle: {
    make: { type: String },
    model: { type: String },
    color: { type: String }
  },
  passengers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  instantBooking: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  cancelReason: { type: String },
  paymentType: { type: String, enum: ['cash', 'upi', 'card', 'online'], default: 'cash' }
}, {
  timestamps: true
});

export default mongoose.model<IRide>('Ride', RideSchema);
