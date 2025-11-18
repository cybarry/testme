// app/api/teacher/banks/[bankId]/upload/route.ts
import { connectDB } from '@/lib/db';
import { QuestionBank } from '@/lib/schemas/question-bank.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ bankId: string }> }  // ← This is the key!
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // ← THIS IS THE FIX: await the params!
    const params = await context.params;
    const bankId = params.bankId;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const content = await file.text();
    let questions;
    try {
      questions = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'JSON must be an array of questions' }, { status: 400 });
    }

    const bank = await QuestionBank.findById(bankId);
    if (!bank) {
      return NextResponse.json({ error: 'Question bank not found' }, { status: 404 });
    }

    // Insert questions
    const createdQuestions = await Promise.all(
      questions.map(async (q: any) => {
        const question = new Question({
          questionText: q.question,
          type: q.question_type,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || '',
          bankId: bankId,
        });
        return await question.save();
      })
    );

    // Update count
    bank.questionCount = await Question.countDocuments({ bankId });
    await bank.save();

    return NextResponse.json(
      { message: 'Questions uploaded successfully!', count: createdQuestions.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload questions' },
      { status: 500 }
    );
  }
}