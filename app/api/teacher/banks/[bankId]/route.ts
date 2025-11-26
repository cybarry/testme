import { connectDB } from '@/lib/db';
import { QuestionBank } from '@/lib/schemas/question-bank.schema';
import { Question } from '@/lib/schemas/question.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bankId: string }> }
) {
  try {
    await connectDB();

    const { bankId } = await params;
    
    const bank = await QuestionBank.findById(bankId);
    const questions = await Question.find({ bankId: bankId });
    
    return NextResponse.json({ bank, questions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bank' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bankId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const bank = await QuestionBank.findById(params.bankId);
    if (!bank || (bank.createdBy.toString() !== currentUser.userId && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await QuestionBank.findByIdAndDelete(params.bankId);
    await Question.deleteMany({ bankId: params.bankId });
    
    return NextResponse.json({ message: 'Bank deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bank' }, { status: 500 });
  }
}
