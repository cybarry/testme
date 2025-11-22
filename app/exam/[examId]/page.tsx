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

  try {

    if (!examId) {
      return <ExamErrorBoundary />;
    }

    // Security: Only students can take exams
    if (!user || user.role !== 'student') {
      return <ExamErrorBoundary message="You must be logged in as a student to take this exam." />;
    }


  } catch (err: any) {
    console.log(err)
    return <ExamErrorBoundary message={err.message} />;
  }


  return (
    <ExamInterface
      examId={examId}
      studentName={user.username || 'Student'}
    />
  );
}
