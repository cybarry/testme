// app/exam/[examId]/page.tsx
import { notFound } from 'next/navigation';
import { ExamInterface } from '@/components/exam/exam-interface';
import { ExamErrorBoundary } from '@/components/exam/exam-error-boundary';
import { getCurrentUser } from '@/lib/auth';  

interface ExamPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { examId } = await params;
  const user = await getCurrentUser();

  // Security: Only students can take exams
  if (!user || user.role !== 'student') {
    return <ExamErrorBoundary message="You must be logged in as a student to take this exam." />;
  }

  let exam = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/exam/${examId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorMsg = res.status === 404 
        ? 'Exam not found' 
        : res.status === 403 
        ? 'This exam is not available or has been closed' 
        : 'Failed to load exam';
      throw new Error(errorMsg);
    }

    const data = await res.json();
    exam = data.exam;
  } catch (err: any) {
    return <ExamErrorBoundary message={err.message} />;
  }

  if (!exam) {
    return <ExamErrorBoundary />;
  }

  return (
    <ExamInterface
      exam={exam}
      studentName={user.username || 'Student'}
    />
  );
}

export async function generateMetadata({ params }: ExamPageProps) {
  const { examId } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/exam/${examId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { title: 'Exam Not Found' };
    const { exam } = await res.json();
    return {
      title: `${exam.title} • CBT Exam`,
      description: 'Secure Computer-Based Test',
    };
  } catch {
    return { title: 'Loading Exam...' };
  }
}