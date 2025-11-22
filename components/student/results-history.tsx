'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultRecord {
  _id: string;
  examId: { title: string };
  normalizedScore: number;
  rawScore: number;
  completedAt: string;
  terminatedForCheating: boolean;
}

export function ResultsHistory() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/student/results');
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted">Loading results...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted mb-4">No exam results yet</p>
        <Button
          onClick={() => window.location.href = '/student/exams'}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          Take an Exam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Card
          key={result._id}
          className="border-border bg-muted-lighter/30 cursor-pointer hover:bg-muted-lighter/50 transition"
          onClick={() => window.location.href = `/student/result/${result._id}`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{result?.examId?.title}</p>
              <p className="text-sm text-muted">
                {new Date(result.completedAt).toLocaleDateString()} at{' '}
                {new Date(result.completedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{result.normalizedScore}</p>
                <p className="text-xs text-muted">/1000</p>
              </div>

              {result.terminatedForCheating && (
                <div className="bg-error/20 text-error text-xs px-3 py-1 rounded">
                  Cheating
                </div>
              )}

              <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
