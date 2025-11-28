import { connectDB } from '@/lib/db';
import { Exam } from '@/lib/schemas/exam.schema';
import { Question } from '@/lib/schemas/question.schema';
import { Score } from '@/lib/schemas/score.schema';
import { StudentProgress } from '@/lib/schemas/student-progress.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { examId } = await params;
    const exam = await Exam.findById(examId);

    if (!exam || !exam.published) {
      return NextResponse.json({ error: 'Exam not found or not published' }, { status: 404 });
    }

    // Check for existing unfinished attempt
    let existingScore = await Score.findOne({
      studentId: currentUser.userId,
      examId,
      status: 'unfinished'
    });

    if (existingScore) {
      // Fetch saved progress to resume
      const savedProgress = await StudentProgress.findOne({
        studentId: currentUser.userId,
        examId
      });

      return NextResponse.json({
        exam: {
          ...exam.toObject(),
          questions: existingScore.questions,
          attemptNumber: existingScore.attemptNumber,
          scoreId: existingScore._id,
        },
        progress: savedProgress
      }, { status: 200 });
    }

    const finishedAttempts = await Score.countDocuments({
      studentId: currentUser.userId,
      examId,
      status: 'finished'
    });

    if (finishedAttempts >= exam.maxAttempts) {
      return NextResponse.json(
        { error: `No more permission. Maximum ${exam.maxAttempts} attempts allowed.` },
        { status: 403 }
      );
    }

    const totalQuestions = exam.numberOfQuestion;
    const trueFalseCount = Math.ceil(totalQuestions * 0.2);
    const singleChoiceCount = Math.ceil(totalQuestions * 0.3);
    const multipleChoiceCount = totalQuestions - trueFalseCount - singleChoiceCount;

    const [trueFalseQuestions, singleChoiceQuestions, multipleChoiceQuestions] = await Promise.all([
      Question.aggregate([
        { $match: { type: 'true_false', bankId: exam.bankId } },
        { $sample: { size: trueFalseCount } },
        { $project: { answer: 0, explanation: 0 } }
      ]),
      Question.aggregate([
        { $match: { type: 'single_choice', bankId: exam.bankId } },
        { $sample: { size: singleChoiceCount } },
        { $project: { answer: 0, explanation: 0 } }
      ]),
      Question.aggregate([
        { $match: { type: 'multiple_choice', bankId: exam.bankId } },
        { $sample: { size: multipleChoiceCount } },
        { $project: { answer: 0, explanation: 0 } }
      ])
    ]);

    const questions = [
      ...trueFalseQuestions,
      ...singleChoiceQuestions,
      ...multipleChoiceQuestions
    ].map(q => ({
      questionType: q.type,
      ...q
    }));

    const newScore = new Score({
      studentId: currentUser.userId,
      examId,
      attemptNumber: finishedAttempts + 1,
      status: 'unfinished',
      questions
    });

    await newScore.save();

    return NextResponse.json({
      exam: {
        ...exam.toObject(),
        questions,
        attemptNumber: newScore.attemptNumber,
        scoreId: newScore._id,
      }
    }, { status: 200 });
  } catch (error) {
    console.log('Error fetching exam:', error);
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}