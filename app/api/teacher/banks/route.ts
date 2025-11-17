import { connectDB } from '@/lib/db';
import { QuestionBank } from '@/lib/schemas/question-bank.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const query = currentUser.role === 'teacher' ? { createdBy: currentUser.userId } : {};
    const banks = await QuestionBank.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ banks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const { name, description } = await request.json();
    
    const bank = new QuestionBank({
      name,
      description,
      createdBy: currentUser.userId
    });
    
    await bank.save();
    
    return NextResponse.json({ bank }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create bank' },
      { status: 500 }
    );
  }
}
