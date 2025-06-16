
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  rating?: number;
  isIDVerified?: boolean;
  isPhoneVerified?: boolean;
  rides?: Ride[];
  bookedRides?: Ride[];
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

export interface BookingRequest {
  id: string;
  passenger: User;
  status: 'pending' | 'accepted' | 'declined';
  requestTime: string;
  message?: string;
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
  amenities?: {
    smoking?: boolean;
    pets?: boolean;
    music?: boolean;
    airConditioning?: boolean;
  };
  stopovers?: string[];
  bookingRequests?: BookingRequest[];
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

export interface Rating {
  id: string;
  rater: User;
  ratee: User;
  ride: Ride;
  rating: number;
  comment?: string;
  type: 'driver' | 'passenger';
  createdAt: string;
  updatedAt: string;
}
