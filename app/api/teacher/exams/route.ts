import { connectDB } from '@/lib/db';
import { Exam } from '@/lib/schemas/exam.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const query = currentUser.role === 'teacher' ? { createdBy: currentUser.userId } : {};
    const exams = await Exam.find(query)
      .populate('bankId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ exams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const { title, description, bankId, duration, passingScore } = await request.json();
    
    // Get questions from bank
    const questions = await Question.find({ bankId });
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions in bank' },
        { status: 400 }
      );
    }
    
    // Shuffle and select questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    
    const exam = new Exam({
      title,
      description,
      bankId,
      questions: shuffled.map(q => q._id),
      duration,
      passingScore: passingScore || 500,
      createdBy: currentUser.userId,
      published: false
    });
    
    await exam.save();
    
    return NextResponse.json({ exam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create exam' },
      { status: 500 }
    );
  }
}
