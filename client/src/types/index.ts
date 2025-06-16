
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  rating?: number;
  rides?: Ride[];
  bookedRides?: Ride[];
}

export interface Ride {
  id: string;
  driver: User;
  from: Location;
  to: Location;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  vehicle?: Vehicle;
  passengers?: User[];
  instantBooking?: boolean;
  status: 'active' | 'completed' | 'cancelled';
  cancelReason?: string;
  paymentType?: 'cash' | 'upi' | 'card' | 'online';
}

export interface Location {
  name: string;
  address: string;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
}

export interface Message {
  id: string;
  sender: User;
  recipient: User;
  content: string;
  timestamp: string;
  rideId?: string;
  read: boolean;
}
