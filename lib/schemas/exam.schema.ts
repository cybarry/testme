import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionBank',
      required: true
    },
    numberOfQuestion: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    passingScore: {
      type: Number,
      default: 500
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

export const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);
