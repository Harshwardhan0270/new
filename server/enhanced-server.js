const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const memoryDB = require('./database/memoryDB');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = memoryDB.findUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role } = req.body;

    // Check if user exists
    const existingUser = memoryDB.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = memoryDB.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'student',
      isActive: true
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = memoryDB.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  try {
    const user = memoryDB.findUserById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ COURSE ROUTES ============

// Get all courses
app.get('/api/courses', (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.search = search;

    let courses = memoryDB.findCourses(query);
    
    // Add instructor details
    courses = courses.map(course => ({
      ...course,
      instructor: memoryDB.findUserById(course.instructor)
    }));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    res.json({
      success: true,
      courses: paginatedCourses,
      totalPages: Math.ceil(courses.length / limit),
      currentPage: parseInt(page),
      total: courses.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
app.get('/api/courses/:id', (req, res) => {
  try {
    const course = memoryDB.findCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add instructor details
    const instructor = memoryDB.findUserById(course.instructor);
    const courseWithInstructor = {
      ...course,
      instructor
    };

    res.json({
      success: true,
      course: courseWithInstructor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course
app.post('/api/courses', [
  auth,
  body('title').notEmpty().withMessage('Course title is required'),
  body('description').notEmpty().withMessage('Course description is required'),
  body('category').notEmpty().withMessage('Course category is required')
], (req, res) => {
  try {
    // Check if user is instructor or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create courses' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = memoryDB.createCourse(courseData);
    
    // Add instructor details
    const instructor = memoryDB.findUserById(course.instructor);
    const courseWithInstructor = {
      ...course,
      instructor
    };

    res.status(201).json({
      success: true,
      course: courseWithInstructor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ ENROLLMENT ROUTES ============

// Enroll in course
app.post('/api/enrollments/:courseId', auth, (req, res) => {
  try {
    const course = memoryDB.findCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollments = memoryDB.findEnrollmentsByStudent(req.user.id);
    const alreadyEnrolled = existingEnrollments.find(e => e.course === req.params.courseId);
    
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = memoryDB.createEnrollment({
      student: req.user.id,
      course: req.params.courseId,
      progress: course.lessons.map(lesson => ({
        lessonId: lesson.id,
        completed: false,
        watchTime: 0
      }))
    });

    // Add student to course
    course.enrolledStudents.push(req.user.id);

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's enrolled courses
app.get('/api/enrollments/my-courses', auth, (req, res) => {
  try {
    const enrollments = memoryDB.findEnrollmentsByStudent(req.user.id);
    
    // Add course and instructor details
    const enrollmentsWithDetails = enrollments.map(enrollment => {
      const course = memoryDB.findCourseById(enrollment.course);
      const instructor = memoryDB.findUserById(course.instructor);
      
      return {
        ...enrollment,
        course: {
          ...course,
          instructor
        }
      };
    });

    res.json({
      success: true,
      enrollments: enrollmentsWithDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Enhanced LMS Server is working!', 
    timestamp: new Date(),
    features: [
      'Real MongoDB-like functionality',
      'Full authentication system',
      'Course management',
      'Enrollment system',
      'In-memory database with sample data'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Enhanced LMS Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('✅ Using in-memory database with sample data');
  console.log('📊 Sample data includes:');
  console.log('   - 2 users (instructor & student)');
  console.log('   - 3 courses (React, Node.js, UI/UX)');
  console.log('   - 1 enrollment with progress tracking');
  console.log('');
  console.log('🔐 Test credentials:');
  console.log('   Instructor: john@example.com / password123');
  console.log('   Student: jane@example.com / password123');
});