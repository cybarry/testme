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
    attemptNumber: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['unfinished', 'finished'],
      default: 'unfinished'
    },
    questions: {
      type: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          questionText: String,
          questionType: String,
          options: mongoose.Schema.Types.Mixed
        }
      ],
      default: []
    },
    rawScore: Number,
    normalizedScore: Number,
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
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  },
  { timestamps: true }
);

export const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);
