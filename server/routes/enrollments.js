const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments/:courseId
// @desc    Enroll in a course
// @access  Private
router.post('/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      course: req.params.courseId,
      progress: course.lessons.map(lesson => ({
        lessonId: lesson._id,
        completed: false
      }))
    });

    await enrollment.save();

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title description thumbnail instructor totalDuration')
      .populate('course.instructor', 'firstName lastName');

    res.json({
      success: true,
      enrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/enrollments/:id/progress
// @desc    Update lesson progress
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { lessonId, completed, watchTime } = req.body;
    
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Find and update lesson progress
    const progressItem = enrollment.progress.find(p => 
      p.lessonId.toString() === lessonId
    );

    if (progressItem) {
      progressItem.completed = completed;
      progressItem.watchTime = watchTime || progressItem.watchTime;
      if (completed && !progressItem.completedAt) {
        progressItem.completedAt = new Date();
      }
    } else {
      enrollment.progress.push({
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
        watchTime: watchTime || 0
      });
    }

    // Recalculate completion percentage
    enrollment.calculateProgress();
    await enrollment.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(enrollment.course.toString()).emit('student-progress-update', {
        studentId: req.user.id,
        lessonId,
        courseId: enrollment.course,
        completed,
        completionPercentage: enrollment.completionPercentage
      });
    }

    res.json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/course/:courseId/students
// @desc    Get course enrollment statistics (for instructors)
// @access  Private (Instructor/Admin)
router.get('/course/:courseId/students', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName email avatar')
      .sort({ enrolledAt: -1 });

    const stats = {
      totalStudents: enrollments.length,
      completedStudents: enrollments.filter(e => e.isCompleted).length,
      averageProgress: enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / enrollments.length || 0,
      recentEnrollments: enrollments.slice(0, 10)
    };

    res.json({
      success: true,
      enrollments,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;