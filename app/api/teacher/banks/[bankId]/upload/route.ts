import { connectDB } from '@/lib/db';
import { QuestionBank } from '@/lib/schemas/question-bank.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bankId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const content = await file.text();
    const questions = JSON.parse(content);
    
    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }
    
    const { bankId } = await params;
    const bank = await QuestionBank.findById(bankId);
    if (!bank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }
    
    // Validate and insert questions
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new Question({
          questionText: q.question,
          type: q.question_type,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || '',
          bankId: bankId
        });
        return question.save();
      })
    );
    
    // Update bank question count
    bank.questionCount = await Question.countDocuments({ bankId: bankId });
    await bank.save();
    
    return NextResponse.json(
      { message: 'Questions uploaded', count: createdQuestions.length },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to upload questions' },
      { status: 500 }
    );
  }
}
