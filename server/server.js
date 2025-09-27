const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const assessmentRoutes = require('./routes/assessments');
const mediaRoutes = require('./routes/media');
const { router: notificationRoutes } = require('./routes/notifications');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB Atlas (cloud database)
const connectDB = async () => {
  try {
    // Using MongoDB Atlas free tier
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://lmsuser:lmspassword123@cluster0.mongodb.net/online_lms?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io for real-time features
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join course room
  socket.on('join-course', (courseId) => {
    socket.join(courseId);
    console.log(`User ${socket.id} joined course ${courseId}`);
  });

  // Leave course room
  socket.on('leave-course', (courseId) => {
    socket.leave(courseId);
    console.log(`User ${socket.id} left course ${courseId}`);
  });

  // Real-time progress updates
  socket.on('lesson-completed', (data) => {
    socket.to(data.courseId).emit('student-progress-update', {
      studentId: data.studentId,
      lessonId: data.lessonId,
      courseId: data.courseId,
      timestamp: new Date()
    });
  });

  // Live chat in courses
  socket.on('course-message', (data) => {
    socket.to(data.courseId).emit('new-course-message', {
      message: data.message,
      sender: data.sender,
      courseId: data.courseId,
      timestamp: new Date()
    });
  });

  // Assessment notifications
  socket.on('assessment-submitted', (data) => {
    socket.to(data.courseId).emit('assessment-submission', {
      studentId: data.studentId,
      assessmentId: data.assessmentId,
      courseId: data.courseId,
      score: data.score,
      timestamp: new Date()
    });
  });

  // Instructor announcements
  socket.on('course-announcement', (data) => {
    socket.to(data.courseId).emit('new-announcement', {
      title: data.title,
      message: data.message,
      courseId: data.courseId,
      instructor: data.instructor,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, io };