import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
import { Exam } from '@/lib/schemas/exam.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const score = await Score.findById(params.resultId)
      .populate('studentId', 'username')
      .populate('examId');
    
    if (!score || score.studentId._id.toString() !== currentUser.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ score }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
  }
}
