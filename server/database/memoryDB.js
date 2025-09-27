// In-memory database for development/demo purposes
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.assessments = new Map();
    this.submissions = new Map();
    this.notifications = new Map();
    
    // Initialize with sample data
    this.initSampleData();
  }

  initSampleData() {
    // Sample users
    const sampleUsers = [
      {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '$2a$10$hash', // hashed password
        role: 'instructor',
        avatar: '',
        bio: 'Experienced web developer and instructor',
        isActive: true,
        enrolledCourses: [],
        createdCourses: ['course1', 'course2'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: '$2a$10$hash',
        role: 'student',
        avatar: '',
        bio: '',
        isActive: true,
        enrolledCourses: ['course1'],
        createdCourses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Sample courses
    const sampleCourses = [
      {
        id: 'course1',
        title: 'Complete React Development Course',
        description: 'Learn React from basics to advanced concepts including hooks, context, and state management.',
        instructor: 'user1',
        category: 'Programming',
        level: 'Intermediate',
        price: 99,
        thumbnail: '/api/placeholder/400/300',
        lessons: [
          {
            id: 'lesson1',
            title: 'Introduction to React',
            description: 'Getting started with React fundamentals',
            videoUrl: '/api/placeholder/video',
            duration: 30,
            materials: [],
            order: 1
          },
          {
            id: 'lesson2',
            title: 'Components and Props',
            description: 'Understanding React components and props',
            videoUrl: '/api/placeholder/video',
            duration: 45,
            materials: [],
            order: 2
          },
          {
            id: 'lesson3',
            title: 'State and Hooks',
            description: 'Managing state with React hooks',
            videoUrl: '/api/placeholder/video',
            duration: 60,
            materials: [],
            order: 3
          }
        ],
        enrolledStudents: ['user2'],
        totalDuration: 135,
        isPublished: true,
        tags: ['react', 'javascript', 'frontend'],
        requirements: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
        learningOutcomes: ['Build React applications', 'Understand component lifecycle', 'Use React hooks effectively'],
        rating: { average: 4.5, count: 23 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course2',
        title: 'Node.js Backend Development',
        description: 'Master backend development with Node.js, Express, and MongoDB.',
        instructor: 'user1',
        category: 'Programming',
        level: 'Advanced',
        price: 149,
        thumbnail: '/api/placeholder/400/300',
        lessons: [
          {
            id: 'lesson4',
            title: 'Node.js Fundamentals',
            description: 'Understanding Node.js runtime and modules',
            videoUrl: '/api/placeholder/video',
            duration: 40,
            materials: [],
            order: 1
          },
          {
            id: 'lesson5',
            title: 'Express.js Framework',
            description: 'Building APIs with Express.js',
            videoUrl: '/api/placeholder/video',
            duration: 55,
            materials: [],
            order: 2
          }
        ],
        enrolledStudents: [],
        totalDuration: 95,
        isPublished: true,
        tags: ['nodejs', 'express', 'backend'],
        requirements: ['JavaScript proficiency', 'Understanding of web concepts'],
        learningOutcomes: ['Build REST APIs', 'Handle authentication', 'Database integration'],
        rating: { average: 4.8, count: 15 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course3',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of user interface and user experience design.',
        instructor: 'user1',
        category: 'Design',
        level: 'Beginner',
        price: 0,
        thumbnail: '/api/placeholder/400/300',
        lessons: [
          {
            id: 'lesson6',
            title: 'Design Principles',
            description: 'Understanding basic design principles',
            videoUrl: '/api/placeholder/video',
            duration: 35,
            materials: [],
            order: 1
          }
        ],
        enrolledStudents: [],
        totalDuration: 35,
        isPublished: true,
        tags: ['design', 'ui', 'ux'],
        requirements: ['No prior experience needed'],
        learningOutcomes: ['Understand design principles', 'Create user-friendly interfaces'],
        rating: { average: 4.2, count: 8 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleCourses.forEach(course => this.courses.set(course.id, course));

    // Sample enrollment
    this.enrollments.set('enrollment1', {
      id: 'enrollment1',
      student: 'user2',
      course: 'course1',
      enrolledAt: new Date(),
      progress: [
        { lessonId: 'lesson1', completed: true, completedAt: new Date(), watchTime: 1800 },
        { lessonId: 'lesson2', completed: false, completedAt: null, watchTime: 900 },
        { lessonId: 'lesson3', completed: false, completedAt: null, watchTime: 0 }
      ],
      completionPercentage: 33,
      isCompleted: false,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Helper methods
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User methods
  findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id);
  }

  createUser(userData) {
    const id = this.generateId();
    const user = {
      id,
      ...userData,
      enrolledCourses: [],
      createdCourses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Course methods
  findCourses(query = {}) {
    let courses = Array.from(this.courses.values());
    
    if (query.category) {
      courses = courses.filter(c => c.category === query.category);
    }
    if (query.level) {
      courses = courses.filter(c => c.level === query.level);
    }
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    if (query.isPublished !== undefined) {
      courses = courses.filter(c => c.isPublished === query.isPublished);
    }

    return courses;
  }

  findCourseById(id) {
    return this.courses.get(id);
  }

  createCourse(courseData) {
    const id = this.generateId();
    const course = {
      id,
      ...courseData,
      lessons: [],
      enrolledStudents: [],
      totalDuration: 0,
      isPublished: false,
      rating: { average: 0, count: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }

  updateCourse(id, updateData) {
    const course = this.courses.get(id);
    if (course) {
      Object.assign(course, updateData, { updatedAt: new Date() });
      this.courses.set(id, course);
    }
    return course;
  }

  // Enrollment methods
  findEnrollmentsByStudent(studentId) {
    return Array.from(this.enrollments.values()).filter(e => e.student === studentId);
  }

  findEnrollmentsByCourse(courseId) {
    return Array.from(this.enrollments.values()).filter(e => e.course === courseId);
  }

  createEnrollment(enrollmentData) {
    const id = this.generateId();
    const enrollment = {
      id,
      ...enrollmentData,
      enrolledAt: new Date(),
      progress: [],
      completionPercentage: 0,
      isCompleted: false,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }
}

module.exports = new MemoryDB();