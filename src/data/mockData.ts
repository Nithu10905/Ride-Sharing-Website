
import { User, Ride, Message } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Mohan",
    email: "mohan@example.com",
    phone: "+91 9876543210",
    rating: 3.7
  },
  {
    id: "2",
    name: "Nalla",
    email: "nalla@example.com",
    phone: "+91 9876543211",
    rating: 5.0
  },
  {
    id: "3",
    name: "Vikram",
    email: "vikram@example.com",
    phone: "+91 9876543212",
    rating: 4.0
  }
];

export const mockRides: Ride[] = [
  {
    id: "1",
    driver: mockUsers[0],
    from: {
      name: "Kadapa",
      address: "38/175-11, Tirupati Rd, Shanthi Nagar, Rama Krishna Nagar, Andhra Pradesh"
    },
    to: {
      name: "Kurnool",
      address: "3H 27, Guru Raghavendra Nagar, Andhra Pradesh"
    },
    departureTime: "2025-05-14T17:10:00",
    arrivalTime: "2025-05-14T20:00:00",
    price: 530,
    availableSeats: 3,
    vehicle: {
      make: "Toyota",
      model: "Etios",
      color: "White"
    },
    instantBooking: true,
    status: "active"
  },
  {
    id: "2",
    driver: mockUsers[1],
    from: {
      name: "Kadapa",
      address: "Railway Station Rd, Maria Puram, Kadapa, Andhra Pradesh 516001, India"
    },
    to: {
      name: "Kurnool",
      address: "Sama Arcade, Raj Talkies Rd, Gandhi Nagar, Kurnool, Andhra Pradesh 518001, India"
    },
    departureTime: "2025-05-14T17:30:00",
    arrivalTime: "2025-05-14T20:20:00",
    price: 450,
    availableSeats: 2,
    instantBooking: true,
    status: "active"
  },
  {
    id: "3",
    driver: mockUsers[2],
    from: {
      name: "Kadapa",
      address: "Railway Station Rd, Maria Puram, Kadapa, Andhra Pradesh 516001, India"
    },
    to: {
      name: "Kurnool",
      address: "Sama Arcade, Raj Talkies Rd, Gandhi Nagar, Kurnool, Andhra Pradesh 518001, India"
    },
    departureTime: "2025-05-14T19:00:00",
    arrivalTime: "2025-05-14T21:50:00",
    price: 450,
    availableSeats: 3,
    vehicle: {
      make: "Maruti",
      model: "Swift Dzire",
      color: "Dark grey"
    },
    instantBooking: true,
    status: "active"
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: mockUsers[0],
    recipient: mockUsers[2],
    content: "Hi, I'm interested in your ride from Kadapa to Kurnool.",
    timestamp: "2025-05-12T10:30:00",
    rideId: "3",
    read: true
  },
  {
    id: "2",
    sender: mockUsers[2],
    recipient: mockUsers[0],
    content: "Sure, I have 3 seats available. When would you like to travel?",
    timestamp: "2025-05-12T11:45:00",
    rideId: "3",
    read: false
  }
];

// Current logged in user for development
export const currentUser: User = {
  id: "0",
  name: "Sai Kumar",
  email: "sai.kumar@example.com",
  phone: "+91 9876543213"
};
