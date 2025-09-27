# Online Learning Management System - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Environment Setup

#### Server Environment (.env)
Create `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online_lms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=50000000
FILE_UPLOAD_PATH=./uploads

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

#### Client Environment (optional)
Create `client/.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Database will be created automatically

#### Option B: MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in server/.env

### 4. Start Development Servers

```bash
# Start both client and server
npm run dev

# Or start individually:
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Default Test Accounts

After starting the application, you can register new accounts or create test data.

### Sample User Registration:
- **Student Account**: Register with role "student"
- **Instructor Account**: Register with role "instructor"

## Features Available

### For Students:
- Browse and search courses
- Enroll in courses
- Track learning progress
- Take assessments
- View dashboard with enrolled courses

### For Instructors:
- Create and manage courses
- Add lessons and materials
- Create assessments
- View student progress
- Manage course content

### For Admins:
- All instructor features
- User management
- System administration

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get course by ID
- POST `/api/courses` - Create course (instructor/admin)
- PUT `/api/courses/:id` - Update course
- DELETE `/api/courses/:id` - Delete course

### Enrollments
- POST `/api/enrollments/:courseId` - Enroll in course
- GET `/api/enrollments/my-courses` - Get user's courses

### Assessments
- POST `/api/assessments` - Create assessment
- GET `/api/assessments/course/:courseId` - Get course assessments

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network access for Atlas

2. **Port Already in Use**
   - Change PORT in server/.env
   - Kill existing processes on ports 3000/5000

3. **CORS Issues**
   - Verify CLIENT_URL in server/.env
   - Check proxy setting in client/package.json

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Clear browser localStorage
   - Check token expiration

## Production Deployment

### Environment Variables for Production:
```
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_production_frontend_url
```

### Build Commands:
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Next Steps

1. Add video streaming integration (AWS S3, Cloudinary)
2. Implement payment processing (Stripe)
3. Add real-time chat/messaging
4. Implement advanced analytics
5. Add mobile app support
6. Integrate with external LTI tools

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify environment variables