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

    const { examId, cheatingAttempts, terminatedForCheating } = await request.json();

    const progress = await StudentProgress.findOne({
      studentId: currentUser.userId,
      examId
    });

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Calculate score
    let correctCount = 0;
    const incorrectAnswers = [];
    const questionsDict: { [key: string]: any } = {};

    for (const answer of progress.answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;
      questionsDict[question._id] = question;

      const isCorrect = JSON.stringify(answer.selectedAnswer) === JSON.stringify(question.answer);

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

    // Create score record
    const score = new Score({
      studentId: currentUser.userId,
      examId,
      rawScore: correctCount,
      normalizedScore: Math.round(normalizedScore),
      correctAnswers: progress.answers
        .filter((a: any) => {
          const q = questionsDict[a.questionId.toString()];
          return q && JSON.stringify(a.selectedAnswer) === JSON.stringify(q.answer);
        })
        .map((a: any) => a.questionId),
      incorrectAnswers,
      cheatingAttempts,
      terminatedForCheating
    });

    await score.save();

    // Mark progress as completed
    progress.completed = true;
    await progress.save();

    return NextResponse.json({
      score: {
        id: score._id,
        normalizedScore: score.normalizedScore,
        rawScore: score.rawScore,
        totalQuestions: exam.numberOfQuestions,
        passed: normalizedScore >= exam.passingScore
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}
