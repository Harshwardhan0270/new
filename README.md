# 🎓 Online Learning Management System

A comprehensive full-stack learning management system built with modern web technologies. This LMS provides a complete solution for online education with course management, student enrollment, progress tracking, assessments, and real-time features.

![LMS Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Instructor, Admin)
- Secure password hashing
- Protected routes and API endpoints

### 📚 Course Management
- Create and edit courses with rich content
- Video lesson uploads and streaming
- Course categorization and search
- Progress tracking and analytics
- Course ratings and reviews

### 👨‍🎓 Student Features
- Browse and enroll in courses
- Track learning progress
- Take assessments and quizzes
- Receive real-time notifications
- Personal dashboard with statistics

### 👨‍🏫 Instructor Features
- Create and manage courses
- Upload video content and materials
- Create assessments and quizzes
- Monitor student progress
- Real-time student analytics

### 📊 Assessment System
- Multiple question types (MCQ, True/False, Essay)
- Automatic grading
- Time limits and attempt restrictions
- Detailed score reports
- Progress tracking

### 🔄 Real-time Features
- Live notifications
- Progress updates
- Course announcements
- Real-time chat (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Material-UI (MUI)** - Component library for consistent design
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Socket.io** - Real-time features
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Security & Performance
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - API protection
- **Input validation** - Data sanitization
- **File upload restrictions** - Security measures

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/online-lms.git
cd online-lms
```

2. **Install dependencies**
```bash
npm install
npm run install:all
```

3. **Environment Setup**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online_lms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the application**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
online-lms/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend application
│   ├── database/          # Database utilities
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── package.json
├── docs/                 # Documentation
├── .gitignore
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `POST /api/enrollments/:courseId` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's courses
- `PUT /api/enrollments/:id/progress` - Update progress

### Assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/course/:courseId` - Get course assessments
- `POST /api/assessments/:id/submit` - Submit assessment

### Media
- `POST /api/media/upload-video` - Upload video
- `GET /api/media/stream/:filename` - Stream video
- `POST /api/media/upload-thumbnail` - Upload thumbnail

## 🎯 Usage Examples

### Student Workflow
1. Register as a student
2. Browse available courses
3. Enroll in courses
4. Watch video lessons
5. Take assessments
6. Track progress on dashboard

### Instructor Workflow
1. Register as an instructor
2. Create new courses
3. Add lessons and materials
4. Upload video content
5. Create assessments
6. Monitor student progress

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin security
- **File Upload Security** - Type and size restrictions

## 📊 Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Compressed thumbnails
- **Database Indexing** - Optimized queries
- **Caching** - Strategic caching implementation
- **Bundle Optimization** - Minimized bundle sizes

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_production_frontend_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Material-UI for the component library
- MongoDB for the database solution
- All contributors and testers

## 📞 Support

For support, email support@yourdomain.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with external tools (Zoom, Google Meet)
- [ ] AI-powered course recommendations
- [ ] Multi-language support
- [ ] Advanced video features (subtitles, playback speed)
- [ ] Gamification features
- [ ] Certificate generation

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**