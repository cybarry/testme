'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultViewProps {
  resultId: string;
}

interface IncorrectAnswer {
  questionId: string;
  selectedAnswer: any;
  correctAnswer: any;
}

interface Result {
  _id: string;
  normalizedScore: number;
  rawScore: number;
  examId: { title: string; questions: any[]; passingScore: number };
  correctAnswers: string[];
  incorrectAnswers: IncorrectAnswer[];
  completedAt: string;
  cheatingAttempts: number;
  terminatedForCheating: boolean;
}

export function ResultView({ resultId }: ResultViewProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/student/results/${resultId}`);
        const data = await response.json();
        setResult(data.score);
      } catch (error) {
        console.error('Failed to fetch result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return <div className="text-muted">Loading result...</div>;
  }

  if (!result) {
    return <div className="text-error">Result not found</div>;
  }

  const passed = result.normalizedScore >= result.examId.passingScore;
  const totalQuestions = result.examId.questions?.length || 1;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className={`border-border ${passed ? 'bg-success/10' : 'bg-error/10'}`}>
        <CardHeader className="text-center">
          <CardTitle className={passed ? 'text-success' : 'text-error'}>
            {passed ? 'Congratulations!' : 'Keep Trying'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-5xl font-bold text-foreground">
            {result.normalizedScore}
            <span className="text-2xl text-muted ml-2">/1000</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted text-sm">Correct</p>
              <p className="text-xl font-bold text-success">{result.correctAnswers.length}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Total Questions</p>
              <p className="text-xl font-bold text-foreground">{totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Passing Score</p>
              <p className="text-xl font-bold text-primary">{result.examId.passingScore}</p>
            </div>
          </div>

          {result.cheatingAttempts > 0 && (
            <div className="bg-error/20 border border-error/30 rounded p-3 text-error text-sm">
              {result.terminatedForCheating
                ? 'This exam was terminated due to cheating violations'
                : `Cheating attempts detected: ${result.cheatingAttempts}`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incorrect Answers */}
      {result.incorrectAnswers.length > 0 && (
        <Card className="border-border bg-muted-lighter/30">
          <CardHeader>
            <CardTitle className="text-foreground">Questions to Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.incorrectAnswers.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded bg-input border border-error/30 space-y-2"
                >
                  <p className="font-medium text-error">Question {idx + 1}</p>
                  <div className="text-sm space-y-1">
                    <p className="text-muted">Your answer: <span className="text-error">{JSON.stringify(item.selectedAnswer)}</span></p>
                    <p className="text-muted">Correct answer: <span className="text-success">{JSON.stringify(item.correctAnswer)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => window.history.back()}
          className="flex-1 bg-muted-lighter hover:bg-muted-lighter/80 text-foreground"
        >
          Back
        </Button>
        <Button
          onClick={() => window.location.href = '/student/exams'}
          className="flex-1 bg-primary hover:bg-primary-dark text-white"
        >
          Take Another Exam
        </Button>
      </div>
    </div>
  );
}
