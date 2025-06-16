
# Setup Guide for Running on Localhost

## Prerequisites
1. **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Install locally or use MongoDB Atlas
3. **Git** (optional) - For version control

## Database Setup Options

### Option 1: Local MongoDB Installation
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS
   brew services start mongodb/brew/mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your connection string

## Project Setup

### 1. Clone/Download the Project
```bash
git clone <your-project-repository>
cd rideshare-app
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/rideshare
NODE_ENV=development
PORT=8080
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
```

Start the backend server:
```bash
npm run dev
# OR
node server.ts
```

### 3. Frontend Setup
```bash
cd client  # or just cd .. if you're in server directory
npm install
```

Start the frontend development server:
```bash
npm run dev
```

## Verification Steps

1. **Check Backend**: Visit `http://localhost:8080/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Check Frontend**: Visit `http://localhost:5173`
   - Should load the rideshare application

3. **Check Database Connection**: Look for console logs:
   - Backend: "✅ Connected to MongoDB successfully"
   - Frontend: "MongoDB connected successfully"

## Testing the Complete Flow

1. **User Registration**: Create a new account
2. **User Login**: Login with your credentials
3. **Publish a Ride**: Create a new ride listing
4. **Search Rides**: Search for available rides
5. **Book a Ride**: Book an available ride
6. **Rate & Review**: Rate your experience

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check the connection string in `.env`
- Verify network connectivity

### Port Conflicts
- Backend runs on port 8080
- Frontend runs on port 5173
- Ensure these ports are not in use by other applications

### CORS Issues
- Backend is configured to allow all origins in development
- If issues persist, check the CORS configuration in `server.ts`

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/rideshare
NODE_ENV=development
PORT=8080
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/rides` - Get all rides
- `POST /api/rides` - Create new ride
- `GET /api/rides/search/find` - Search rides
- `GET /api/ratings/user/:userId` - Get user ratings
- `POST /api/ratings` - Create rating

## Database Collections

The application uses these MongoDB collections:
1. **users** - User accounts and profiles
2. **rides** - Ride listings and bookings
3. **ratings** - User ratings and reviews

## Support

If you encounter any issues:
1. Check the console logs in both frontend and backend
2. Verify all dependencies are installed
3. Ensure MongoDB is running and accessible
4. Check that all environment variables are set correctly
