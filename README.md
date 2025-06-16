<<<<<<< HEAD

# RideShare Application

A full-stack application for sharing rides with other travelers, built with React, TypeScript, Express, and MongoDB.

## Project Structure

- `client/` - React frontend application
- `server/` - Express backend API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd rideshare-app
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `server/` directory with the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/rideshare
   NODE_ENV=development
   PORT=8080
   JWT_SECRET=your_jwt_secret_here
   add email and it's app password for otp
   ```
   - Create a `.env` file in the `client/` directory with the following:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the application:
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## Features

- User authentication (register, login, profile management)
- Publish rides as a driver
- Search for available rides
- Book rides as a passenger
- In-app messaging between users
- User profile and verification

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile
- `PUT /api/users/change-password/:id` - Change user password

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/:id` - Get a specific ride
- `POST /api/rides` - Create a new ride
- `PUT /api/rides/:id` - Update a ride
- `POST /api/rides/:id/book` - Book a ride
- `POST /api/rides/:id/cancel` - Cancel a booking
- `GET /api/rides/search/find` - Search for rides

### Messages
- `GET /api/messages/user/:userId` - Get all messages for a user
- `GET /api/messages/conversation/:user1Id/:user2Id` - Get conversation between two users
- `POST /api/messages` - Send a message
- `PUT /api/messages/read/:userId/:otherUserId` - Mark messages as read

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - React Router
  - Tailwind CSS
  - Shadcn UI
  - Tanstack React Query

- **Backend**:
  - Express
  - MongoDB & Mongoose
  - JWT Authentication
  - TypeScript

