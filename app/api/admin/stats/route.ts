import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import { Exam } from '@/lib/schemas/exam.schema';
import { Score } from '@/lib/schemas/score.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const stats = {
      totalUsers: await User.countDocuments(),
      totalStudents: await User.countDocuments({ role: 'student' }),
      totalTeachers: await User.countDocuments({ role: 'teacher' }),
      totalExams: await Exam.countDocuments(),
      totalSubmissions: await Score.countDocuments(),
      averageScore: await Score.aggregate([
        { $group: { _id: null, avg: { $avg: '$normalizedScore' } } }
      ]).then(r => r[0]?.avg || 0)
    };
    
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
