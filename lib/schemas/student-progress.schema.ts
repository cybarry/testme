import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: mongoose.Schema.Types.Mixed
    }],
    startTime: {
      type: Date,
      default: Date.now
    },
    remainingTime: Number,
    completed: {
      type: Boolean,
      default: false
    },
    cheatingAttempts: {
      type: Number,
      default: 0
    },
    cheatingDetected: {
      type: Boolean,
      default: false
    },
    terminatedForCheating: {
      type: Boolean,
      default: false
    },
    terminatedAt: Date
  },
  { timestamps: true }
);

export const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', studentProgressSchema);
