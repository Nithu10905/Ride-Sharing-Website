
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDB } from './config/db';
import { testEmailConnection } from './utils/emailService';
import userRoutes from './routes/userRoutes';
import rideRoutes from './routes/rideRoutes';
import messageRoutes from './routes/messageRoutes';
import ratingRoutes from './routes/ratingRoutes';
import emailRoutes from './routes/emailRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

console.log('🔧 Starting server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Port:', PORT);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB and test email
connectDB()
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Test email connection
    console.log('🔍 Testing email service...');
    await testEmailConnection();
    
    console.log('🚀 Server ready to accept connections');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: 'connected',
    email: 'configured',
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Backend is working!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📄 API endpoints available at http://localhost:${PORT}/api/`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
