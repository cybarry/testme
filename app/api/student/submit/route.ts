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
    const incorrectAnswers = [];
    const questionsDict: { [key: string]: any } = {};

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;
      questionsDict[question._id.toString()] = question;

      const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
      const selectedAnswers = Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer : [answer.selectedAnswer];

      const isCorrect = correctAnswers.length === selectedAnswers.length &&
        selectedAnswers.every((ans: any) => correctAnswers.includes(ans));

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectAnswers.push({
          questionId: question._id,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.answer
        });
      }
    }

    const normalizedScore = (correctCount / exam.numberOfQuestion) * 1000;

    // Update the score record
    score.rawScore = correctCount;
    score.normalizedScore = Math.round(normalizedScore);
    score.correctAnswers = answers
      .filter((a: any) => {
        const q = questionsDict[a.questionId.toString()];
        return q && JSON.stringify(a.selectedAnswer) === JSON.stringify(q.answer);
      })
      .map((a: any) => a.questionId);
    score.incorrectAnswers = incorrectAnswers;
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
