import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    await connectDB();
    
    const leaderboard = await Score.find({ examId: params.examId })
      .populate('studentId', 'username')
      .sort({ normalizedScore: -1 })
      .limit(50);
    
    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
