'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnswerDetail {
  questionId: string;
  isCorrect: boolean;
  question: {
    _id: string;
    questionText: string;
    type: string;
    options: Record<string, string>;
    answer?: string | string[];
  };
  selectedAnswer: any;
  correctAnswer?: any;
}

interface Result {
  _id: string;
  normalizedScore: number;
  rawScore: number;
  totalQuestions: number;
  passingScore: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: string;
  cheatingAttempts: number;
  terminatedForCheating: boolean;
  examTitle: string;
}

interface ResultViewProps {
  resultId: string;
}

export function ResultView({ resultId }: ResultViewProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchResult(currentPage);
  }, [resultId, currentPage]);

  const fetchResult = async (page: number) => {
    try {
      const response = await fetch(`/api/student/results/${resultId}?page=${page}`);
      const data = await response.json();
      setResult(data.score);
      setAnswers(data.answers);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted">Loading result...</div>;
  }

  if (!result) {
    return <div className="text-error">Result not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Score Summary Card */}
      <Card className={`border-border ${result.passed ? 'bg-success/10' : 'bg-error/10'}`}>
        <CardHeader className="text-center">
          <CardTitle className={result.passed ? 'text-success' : 'text-error'}>
            {result.passed ? 'Congratulations!' : 'Keep Trying'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-5xl font-bold text-foreground">
            {result.normalizedScore}
            <span className="text-2xl text-muted ml-2">/1000</span>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-muted text-sm">Correct</p>
              <p className="text-xl font-bold text-success">{result.rawScore}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Total Questions</p>
              <p className="text-xl font-bold text-foreground">{result.totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Passing Score</p>
              <p className="text-xl font-bold text-primary">{result.passingScore}</p>
            </div>
            <div>
              <p className="text-muted text-sm">Attempt</p>
              <p className="text-xl font-bold text-foreground">#{result.attemptNumber}</p>
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

      {/* Questions Review */}
      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Question Review (Page {currentPage} of {totalPages})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answers.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded border-2 space-y-3 ${
                  item.isCorrect ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <p className={`font-medium text-lg ${item.isCorrect ? 'text-success' : 'text-error'}`}>
                    Question {(currentPage - 1) * pageSize + idx + 1}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.isCorrect
                      ? 'bg-success/20 text-success'
                      : 'bg-error/20 text-error'
                  }`}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-foreground font-medium">{item.question.questionText}</p>

                {/* Question Type */}
                <p className="text-muted text-sm">Type: {item.question.type.replace('_', ' ').toUpperCase()}</p>

                {/* Answer Display */}
                <div className="space-y-2 mt-3">
                  {item.isCorrect ? (
                    <div>
                      <p className="text-muted text-sm mb-1">Your Answer:</p>
                      <div className="bg-success/20 border border-success/30 rounded p-2 text-foreground">
                        {typeof item.selectedAnswer === 'string'
                          ? item.question.options?.[item.selectedAnswer] || item.selectedAnswer
                          : Array.isArray(item.selectedAnswer)
                            ? item.selectedAnswer
                                .map((ans: string) => item.question.options?.[ans] || ans)
                                .join(', ')
                            : JSON.stringify(item.selectedAnswer)}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-muted text-sm mb-1">Your Answer:</p>
                        <div className="bg-error/20 border border-error/30 rounded p-2 text-foreground">
                          {typeof item.selectedAnswer === 'string'
                            ? item.question.options?.[item.selectedAnswer] || item.selectedAnswer
                            : Array.isArray(item.selectedAnswer)
                              ? item.selectedAnswer
                                  .map((ans: string) => item.question.options?.[ans] || ans)
                                  .join(', ')
                              : JSON.stringify(item.selectedAnswer)}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted text-sm mb-1">Correct Answer:</p>
                        <div className="bg-success/20 border border-success/30 rounded p-2 text-foreground">
                          {typeof item.correctAnswer === 'string'
                            ? item.question.options?.[item.correctAnswer] || item.correctAnswer
                            : Array.isArray(item.correctAnswer)
                              ? item.correctAnswer
                                  .map((ans: string) => item.question.options?.[ans] || ans)
                                  .join(', ')
                              : JSON.stringify(item.correctAnswer)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
