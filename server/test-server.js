const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    // Use in-memory or skip MongoDB for now
    console.log('Skipping MongoDB connection for testing...');
    console.log('Server can run without database for basic testing');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});