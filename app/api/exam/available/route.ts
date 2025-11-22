import { connectDB } from '@/lib/db';
import { Exam } from '@/lib/schemas/exam.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const exams = await Exam.find({ published: true })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ exams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}
