'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheatingDetector } from './anti-cheating-detector';
import { CheatingWarningModal } from './cheating-warning-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MAX_VIOLATIONS = 3;

interface Question {
  _id: string;
  questionText: string;
  type: string;
  options: Record<string, string>;
  answer: string | string[];
}

interface ExamInterfaceProps {
  exam: {
    _id: string;
    title: string;
    duration: number;
    questions: Question[];
    passingScore: number;
  };
}

export function ExamInterface({ exam }: ExamInterfaceProps) {
  const router = useRouter();

  // Local state only — NO ZUSTAND HERE
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [cheatingAttempts, setCheatingAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];

  // Initialize exam
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    };

    requestFullscreen();
    setIsExamActive(true);

    // Cleanup on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []); // ← Only run once!

  // Timer
  useEffect(() => {
    if (!isExamActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive]);

  // Auto-save progress
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(answers).length > 0 && isExamActive) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [answers, currentQuestionIndex, cheatingAttempts, isExamActive]);

  const saveProgress = async () => {
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          currentQuestionIndex,
          answers: Object.entries(answers).map(([qId, ans]) => ({
            questionId: qId,
            selectedAnswer: ans,
          })),
          cheatingAttempts,
          terminatedForCheating: isTerminated,
        }),
      });
    } catch (err) {
      console.error('Auto-save failed');
    }
  };

  const handleViolation = () => {
    const newAttempts = cheatingAttempts + 1;
    setCheatingAttempts(newAttempts);
    setShowWarning(true);

    if (newAttempts >= MAX_VIOLATIONS) {
      setIsTerminated(true);
      setTimeout(() => handleSubmit(true), 3000);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (cheated = false) => {
    setIsExamActive(false);

    try {
      const response = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          answers,
          cheatingAttempts,
          terminatedForCheating: cheated || isTerminated,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/student/result/${data.scoreId}`);
      }
    } catch (err) {
      console.error('Submit failed');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CheatingDetector onViolation={handleViolation} isActive={isExamActive} />
      <CheatingWarningModal
        isOpen={showWarning}
        violationCount={cheatingAttempts}
        maxViolations={MAX_VIOLATIONS}
        onContinue={() => setShowWarning(false)}
        onTerminate={() => handleSubmit(true)}
        isTerminated={isTerminated}
      />

      {/* Header */}
      <header className="border-b p-6 bg-muted/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </p>
          </div>
          <div className={`text-3xl font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r p-6 bg-muted/20">
          <h3 className="font-semibold mb-4">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {exam.questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-10 h-10 rounded font-medium text-sm transition-all ${
                  i === currentQuestionIndex
                    ? 'bg-primary text-white'
                    : answers[q._id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-8">{currentQuestion.questionText}</h2>

              <div className="space-y-4 mb-10">
                {currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_or_false' ? (
                  Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label key={key} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name={currentQuestion._id}
                        value={key}
                        checked={answers[currentQuestion._id] === key}
                        onChange={() => handleAnswerChange(currentQuestion._id, key)}
                        className="mr-4"
                      />
                      <span className="text-lg">{value}</span>
                    </label>
                  ))
                ) : (
                  Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label key={key} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={(answers[currentQuestion._id] || []).includes(key)}
                        onChange={(e) => {
                          const current = answers[currentQuestion._id] || [];
                          const newAnswers = e.target.checked
                            ? [...current, key]
                            : current.filter((k: string) => k !== key);
                          handleAnswerChange(currentQuestion._id, newAnswers);
                        }}
                        className="mr-4"
                      />
                      <span className="text-lg">{value}</span>
                    </label>
                  ))
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button onClick={() => handleSubmit()} variant="destructive">
                    Submit Exam
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}