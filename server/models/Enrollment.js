const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  watchTime: {
    type: Number,
    default: 0 // in seconds
  }
});

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: [progressSchema],
  completionPercentage: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  certificateIssued: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Calculate completion percentage
enrollmentSchema.methods.calculateProgress = function() {
  if (!this.progress || this.progress.length === 0) {
    this.completionPercentage = 0;
    return;
  }
  
  const completedLessons = this.progress.filter(p => p.completed).length;
  this.completionPercentage = Math.round((completedLessons / this.progress.length) * 100);
  
  if (this.completionPercentage === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);