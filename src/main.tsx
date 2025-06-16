
import { createRoot } from 'react-dom/client'
import { connectToMongoDB } from './lib/mongodb'
import App from './App.tsx'
import './index.css'

// Connect to MongoDB when the application starts
// The connectToMongoDB function is being called with an argument but doesn't accept any
connectToMongoDB()
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
  })

createRoot(document.getElementById("root")!).render(<App />);
