const express = require('express');
const { Assessment, Submission } = require('../models/Assessment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/assessments
// @desc    Create assessment
// @access  Private (Instructor/Admin)
router.post('/', [auth, authorize('instructor', 'admin')], async (req, res) => {
  try {
    const assessment = new Assessment({
      ...req.body,
      instructor: req.user.id
    });

    await assessment.save();
    
    res.status(201).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assessments/course/:courseId
// @desc    Get assessments for a course
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ 
      course: req.params.courseId,
      isPublished: true 
    }).select('-questions.correctAnswer');

    res.json({
      success: true,
      assessments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assessments/:id
// @desc    Get assessment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let assessment;
    
    if (req.user.role === 'instructor' || req.user.role === 'admin') {
      // Instructors can see correct answers
      assessment = await Assessment.findById(req.params.id)
        .populate('course', 'title')
        .populate('instructor', 'firstName lastName');
    } else {
      // Students cannot see correct answers
      assessment = await Assessment.findById(req.params.id)
        .populate('course', 'title')
        .populate('instructor', 'firstName lastName')
        .select('-questions.correctAnswer');
    }

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assessments/:id/submit
// @desc    Submit assessment
// @access  Private (Student)
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if student has already submitted maximum attempts
    const existingSubmissions = await Submission.find({
      assessment: req.params.id,
      student: req.user.id
    });

    if (existingSubmissions.length >= assessment.attempts) {
      return res.status(400).json({ message: 'Maximum attempts reached' });
    }

    const { answers, timeSpent } = req.body;
    let totalScore = 0;
    const gradedAnswers = [];

    // Grade the assessment
    answers.forEach(answer => {
      const question = assessment.questions.id(answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.answer;
        const points = isCorrect ? question.points : 0;
        totalScore += points;

        gradedAnswers.push({
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          points
        });
      }
    });

    const percentage = Math.round((totalScore / assessment.totalPoints) * 100);
    const isPassed = percentage >= assessment.passingScore;

    const submission = new Submission({
      assessment: req.params.id,
      student: req.user.id,
      answers: gradedAnswers,
      score: totalScore,
      percentage,
      isPassed,
      attemptNumber: existingSubmissions.length + 1,
      timeSpent
    });

    await submission.save();

    res.json({
      success: true,
      submission: {
        score: totalScore,
        percentage,
        isPassed,
        attemptNumber: submission.attemptNumber,
        totalQuestions: assessment.questions.length,
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assessments/:id/submissions
// @desc    Get assessment submissions (for instructors)
// @access  Private (Instructor/Admin)
router.get('/:id/submissions', [auth, authorize('instructor', 'admin')], async (req, res) => {
  try {
    const submissions = await Submission.find({ assessment: req.params.id })
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assessments/my-submissions/:courseId
// @desc    Get student's submissions for a course
// @access  Private (Student)
router.get('/my-submissions/:courseId', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId });
    const assessmentIds = assessments.map(a => a._id);

    const submissions = await Submission.find({
      assessment: { $in: assessmentIds },
      student: req.user.id
    }).populate('assessment', 'title totalPoints passingScore');

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;