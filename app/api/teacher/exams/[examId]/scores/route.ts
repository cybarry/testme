import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
import { User } from '@/lib/schemas/user.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const scores = await Score.find({ examId: params.examId })
      .populate('studentId', 'username')
      .sort({ normalizedScore: -1 });
    
    return NextResponse.json({ scores }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}
