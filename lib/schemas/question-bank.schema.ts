import mongoose from 'mongoose';

const questionBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    description: String,
    questionCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export const QuestionBank = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionBankSchema);
