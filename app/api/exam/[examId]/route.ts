import { connectDB } from '@/lib/db';
import { Exam } from '@/lib/schemas/exam.schema';
import { Question } from '@/lib/schemas/question.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await connectDB();
    const { examId } = await params;
    const exam = await Exam.findById(examId);

    if (!exam || !exam.published) {
      return NextResponse.json({ error: 'Exam not found or not published' }, { status: 404 });
    }

    const totalQuestions = exam.numberOfQuestion;
    const trueFalseCount = Math.ceil(totalQuestions * 0.2); // 10%
    const singleChoiceCount = Math.ceil(totalQuestions * 0.3); // 40%
    const multipleChoiceCount = totalQuestions - trueFalseCount - singleChoiceCount; // Remaining for 50%

    const [trueFalseQuestions, singleChoiceQuestions, multipleChoiceQuestions] = await Promise.all([
      Question.aggregate([
        { $match: { type: 'true_false', questionBank: exam.questionBank } },
        { $sample: { size: trueFalseCount } },
        { $project: { answer: 0 } }
      ]),
      Question.aggregate([
        { $match: { type: 'single_choice', questionBank: exam.questionBank } },
        { $sample: { size: singleChoiceCount } },
        { $project: { answer: 0 } }
      ]),
      Question.aggregate([
        { $match: { type: 'multiple_choice', questionBank: exam.questionBank } },
        { $sample: { size: multipleChoiceCount } },
        { $project: { answer: 0 } }
      ])
    ]);

    const questions = [
      ...trueFalseQuestions,
      ...singleChoiceQuestions,
      ...multipleChoiceQuestions
    ];

    return NextResponse.json({
      exam: {
        ...exam.toObject(),
        questions,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}
