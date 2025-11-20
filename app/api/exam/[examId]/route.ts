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
    console.log('Fetching exam with ID:', examId);
    const exam = await Exam.findById(examId).populate('questions');
    
    if (!exam || !exam.published) {
      return NextResponse.json({ error: 'Exam not found or not published' }, { status: 404 });
    }
    
    return NextResponse.json({ exam }, { status: 200 });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}
