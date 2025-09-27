const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Basic auth routes without database
app.post('/api/auth/register', (req, res) => {
  console.log('Register attempt:', req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful (demo mode)',
    user: {
      id: 'demo-id',
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role || 'student'
    },
    token: 'demo-token'
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  res.json({
    success: true,
    message: 'Login successful (demo mode)',
    user: {
      id: 'demo-id',
      firstName: 'Demo',
      lastName: 'User',
      email: req.body.email,
      role: 'student'
    },
    token: 'demo-token'
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    courses: [
      {
        _id: '1',
        title: 'Introduction to React',
        description: 'Learn the basics of React development',
        category: 'Programming',
        level: 'Beginner',
        price: 0,
        instructor: { firstName: 'John', lastName: 'Doe' }
      },
      {
        _id: '2',
        title: 'Advanced Node.js',
        description: 'Master backend development with Node.js',
        category: 'Programming',
        level: 'Advanced',
        price: 99,
        instructor: { firstName: 'Jane', lastName: 'Smith' }
      }
    ],
    totalPages: 1,
    currentPage: 1,
    total: 2
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error in demo mode' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Demo server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('📝 Note: Running in demo mode without database');
});