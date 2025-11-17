import mongoose from 'mongoose';

export enum QuestionType {
  TRUE_FALSE = 'true_false',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  DRAG_DROP = 'drag_drop'
}

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true
    },
    options: mongoose.Schema.Types.Mixed,
    answer: mongoose.Schema.Types.Mixed,
    explanation: String,
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionBank',
      required: true
    }
  },
  { timestamps: true }
);

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
