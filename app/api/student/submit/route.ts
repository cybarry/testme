import { connectDB } from '@/lib/db';
import { StudentProgress } from '@/lib/schemas/student-progress.schema';
import { Score } from '@/lib/schemas/score.schema';
import { Exam } from '@/lib/schemas/exam.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { examId, scoreId, cheatingAttempts, terminatedForCheating, answers } = await request.json();

    // Find the score record
    const score = await Score.findById(scoreId);

    if (!score) {
      return NextResponse.json({ error: 'Score record not found' }, { status: 404 });
    }

    if (score.studentId.toString() !== currentUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Calculate score
    let correctCount = 0;
    
    // Arrays for legacy support (to prevent breaking old logic)
    const incorrectAnswersLegacy = [];
    const correctAnswersLegacy = [];
    
    // New unified array that stores EVERYTHING
    const processedAnswers = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      // Normalize to array to handle single/multi choice uniformly
      const correctArr = Array.isArray(question.answer) ? question.answer : [question.answer];
      const selectedArr = Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer : [answer.selectedAnswer];

      // Robust check: same length AND every selected item is in correct array
      // This handles cases where order might differ in multiple choice
      const isCorrect = correctArr.length === selectedArr.length &&
        selectedArr.every((ans: any) => correctArr.includes(ans));

      // 1. Update Legacy Counts/Arrays
      if (isCorrect) {
        correctCount++;
        correctAnswersLegacy.push(question._id);
      } else {
        incorrectAnswersLegacy.push({
          questionId: question._id,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.answer
        });
      }

      // 2. Push to NEW Unified Array (Crucial Step for Accuracy)
      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer, // We save this explicitly now
        correctAnswer: question.answer,
        isCorrect: isCorrect
      });
    }

    const normalizedScore = (correctCount / exam.numberOfQuestion) * 1000;

    // Update the score record
    score.rawScore = correctCount;
    score.normalizedScore = Math.round(normalizedScore);
    
    // Save new unified data
    score.answers = processedAnswers; 
    
    // Save legacy data (safety net)
    score.correctAnswers = correctAnswersLegacy;
    score.incorrectAnswers = incorrectAnswersLegacy;
    
    score.cheatingAttempts = cheatingAttempts;
    score.terminatedForCheating = terminatedForCheating;
    score.status = 'finished';
    score.completedAt = new Date();

    await score.save();

    // Delete the progress record
    await StudentProgress.deleteOne({
      studentId: currentUser.userId,
      examId
    });

    return NextResponse.json({
      score: {
        id: score._id,
        normalizedScore: score.normalizedScore,
        rawScore: score.rawScore,
        totalQuestions: exam.numberOfQuestion,
        passed: normalizedScore >= exam.passingScore
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}