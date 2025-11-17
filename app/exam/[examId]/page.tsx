'use client';

import { useState, useEffect } from 'react';
import { ExamInterface } from '@/components/exam/exam-interface';

interface PageProps {
  params: { examId: string };
}

export default function ExamPage({ params }: PageProps) {
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/exam/${params.examId}`);
        if (!response.ok) {
          setError('Exam not found or not published');
          return;
        }
        const data = await response.json();
        setExam(data.exam);
      } catch (err) {
        setError('Failed to load exam');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [params.examId]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading exam...</div>;
  }

  if (error || !exam) {
    return <div className="flex items-center justify-center min-h-screen text-error">{error}</div>;
  }

  return <ExamInterface exam={exam} />;
}
