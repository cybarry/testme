import { connectDB } from '@/lib/db';
import { StudentProgress } from '@/lib/schemas/student-progress.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const { examId, currentQuestionIndex, answers, cheatingAttempts, terminatedForCheating, remainingTime } = await request.json();
    
    let progress = await StudentProgress.findOne({
      studentId: currentUser.userId,
      examId
    });
    
    if (!progress) {
      progress = new StudentProgress({
        studentId: currentUser.userId,
        examId,
        currentQuestionIndex: currentQuestionIndex || 0,
        answers: answers || [],
        cheatingAttempts: cheatingAttempts || 0,
        terminatedForCheating: terminatedForCheating || false,
        remainingTime: remainingTime,
        startTime: new Date()
      });
    } else {
      progress.currentQuestionIndex = currentQuestionIndex;
      progress.answers = answers;
      progress.cheatingAttempts = cheatingAttempts;
      progress.terminatedForCheating = terminatedForCheating;
      
      if (remainingTime !== undefined && remainingTime !== null) {
        progress.remainingTime = remainingTime;
      }
    }
    
    await progress.save();
    
    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error("Progress save error:", error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const examId = request.nextUrl.searchParams.get('examId');
    
    const progress = await StudentProgress.findOne({
      studentId: currentUser.userId,
      examId
    });
    
    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}