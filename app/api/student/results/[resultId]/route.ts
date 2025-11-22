import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resultId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { resultId } = await params;
    const page = request.nextUrl.searchParams.get('page') || '1';
    const pageSize = 10;
    const pageNum = Math.max(1, parseInt(page));

    const score = await Score.findById(resultId)
      .populate('studentId', 'username')
      .populate('examId');

    if (!score || score.studentId._id.toString() !== currentUser.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (score.status !== 'finished') {
      return NextResponse.json({ error: 'Result not finished' }, { status: 400 });
    }

    // Fetch all questions details
    const allQuestionIds = [
      ...score.correctAnswers,
      ...score.incorrectAnswers.map((ia: any) => ia.questionId)
    ];

    const questions = await Question.find({
      _id: { $in: allQuestionIds }
    });

    const questionsMap = new Map(questions.map(q => [q._id.toString(), q]));

    // Build complete answers list with correctness status
    const allAnswers = [
      ...score.correctAnswers.map((qId: any) => ({
        questionId: qId,
        isCorrect: true,
        question: questionsMap.get(qId.toString()),
        selectedAnswer: null
      })),
      ...score.incorrectAnswers.map((ia: any) => ({
        questionId: ia.questionId,
        isCorrect: false,
        question: questionsMap.get(ia.questionId.toString()),
        selectedAnswer: ia.selectedAnswer,
        correctAnswer: ia.correctAnswer
      }))
    ];

    // Calculate pagination
    const totalAnswers = allAnswers.length;
    const totalPages = Math.ceil(totalAnswers / pageSize);
    const startIdx = (pageNum - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedAnswers = allAnswers.slice(startIdx, endIdx);

    return NextResponse.json({
      score: {
        id: score._id,
        normalizedScore: score.normalizedScore,
        rawScore: score.rawScore,
        totalQuestions: score.examId.numberOfQuestion,
        passingScore: score.examId.passingScore,
        passed: score.normalizedScore >= score.examId.passingScore,
        attemptNumber: score.attemptNumber,
        completedAt: score.completedAt,
        cheatingAttempts: score.cheatingAttempts,
        terminatedForCheating: score.terminatedForCheating,
        examTitle: score.examId.title
      },
      answers: paginatedAnswers,
      pagination: {
        page: pageNum,
        pageSize,
        totalAnswers,
        totalPages
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
  }
}
