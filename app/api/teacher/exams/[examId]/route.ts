import { connectDB } from '@/lib/db';
import { Exam } from '@/lib/schemas/exam.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const exam = await Exam.findById(params.examId);
    if (!exam || (exam.createdBy.toString() !== currentUser.userId && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const { published, title, duration, passingScore } = await request.json();
    
    const updatedExam = await Exam.findByIdAndUpdate(
      params.examId,
      { published, title, duration, passingScore },
      { new: true }
    );
    
    return NextResponse.json({ exam: updatedExam }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const exam = await Exam.findById(params.examId);
    if (!exam || (exam.createdBy.toString() !== currentUser.userId && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await Exam.findByIdAndDelete(params.examId);
    
    return NextResponse.json({ message: 'Exam deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}
