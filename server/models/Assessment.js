const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    default: 'multiple-choice'
  },
  options: [String], // For multiple choice questions
  correctAnswer: String,
  points: {
    type: Number,
    default: 1
  },
  explanation: String
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 60
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    default: 70 // percentage
  },
  attempts: {
    type: Number,
    default: 3
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  instructions: String
}, {
  timestamps: true
});

// Calculate total points when questions are updated
assessmentSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((total, question) => {
      return total + (question.points || 0);
    }, 0);
  }
  next();
});

const submissionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  timeSpent: Number, // in minutes
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { Assessment, Submission };