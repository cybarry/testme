import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
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
    rawScore: Number,
    normalizedScore: {
      type: Number,
      required: true
    },
    correctAnswers: [mongoose.Schema.Types.ObjectId],
    incorrectAnswers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: mongoose.Schema.Types.Mixed,
      correctAnswer: mongoose.Schema.Types.Mixed
    }],
    cheatingAttempts: {
      type: Number,
      default: 0
    },
    terminatedForCheating: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);
