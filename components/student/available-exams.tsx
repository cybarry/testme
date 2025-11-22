'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  numberOfQuestion: any[];
}

export function AvailableExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exam/available');
      const data = await response.json();
      setExams(data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted">Loading exams...</div>;
  }

  if (exams.length === 0) {
    return <div className="text-center p-8 text-muted">No exams available</div>;
  }

  return (
    <div className="grid gap-4">
      {exams.map((exam) => (
        <Card key={exam._id} className="border-border bg-muted-lighter/30 hover:bg-muted-lighter/50 transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                {exam.description && (
                  <p className="text-sm text-muted mt-1">{exam.description}</p>
                )}
                <div className="flex gap-4 mt-3 text-sm text-muted">
                  <span>{exam.numberOfQuestion || 0} Questions</span>
                  <span>{exam.duration} Minutes</span>
                </div>
              </div>

              <Button
                onClick={() => window.location.href = `/exam/${exam._id}`}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
