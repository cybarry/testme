'use client';

import { useState, useEffect } from 'react';
import { ExamInterface } from '@/components/exam/exam-interface';

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>; // params is a Promise!
}) {
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadExam() {
      try {
        const resolvedParams = await params; // await here!
        const examId = resolvedParams.examId;

        const response = await fetch(`/api/exam/${examId}`);
        if (!response.ok) {
          throw new Error('Exam not found or not published');
        }
        const data = await response.json();
        if (isMounted) {
          setExam(data.exam);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load exam');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadExam();

    return () => {
      isMounted = false;
    };
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground">
        Loading exam...
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex items-center justify-center min-h-screen text-error">
        {error || 'Exam not found'}
      </div>
    );
  }

  return <ExamInterface exam={exam} />;
}