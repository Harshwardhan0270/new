# Online Learning Management System

A comprehensive full-stack learning management system built with React, Node.js, and MongoDB.

## Features

- User authentication and authorization (Students, Instructors, Admins)
- Course creation and management
- Student enrollment and progress tracking
- Video lecture streaming
- Assessment and quiz system
- Real-time notifications
- Responsive design

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Socket.io for real-time features

## Project Structure

```
/
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared types and utilities
└── docs/           # Documentation
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Set up environment variables
4. Start development servers: `npm run dev`

## Environment Variables

Create `.env` files in both client and server directories with required variables.