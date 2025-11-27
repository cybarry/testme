import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const results = await Score.find({ 
      studentId: currentUser.userId,
      status: 'finished'
    })
      .populate('examId')
      .sort({ completedAt: -1 });
    
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.log('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
