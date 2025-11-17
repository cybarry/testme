'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/lib/zustand-store';
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
  const store = useExamStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [cheatingAttempts, setCheatingAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];

  // Initialize exam state
  useEffect(() => {
    store.setExamId(exam._id);
    store.setRemainingTime(exam.duration * 60);
    
    // Request fullscreen
    requestFullscreenIfSupported();
    setIsExamActive(true);
  }, [exam._id, exam.duration, store]);

  const requestFullscreenIfSupported = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.log('Fullscreen not available');
    }
  };

  // Timer countdown
  useEffect(() => {
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
  }, []);

  // Save progress periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        saveProgress();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [answers, currentQuestionIndex, cheatingAttempts]);

  const saveProgress = async () => {
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          currentQuestionIndex,
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer
          })),
          cheatingAttempts,
          terminatedForCheating: isTerminated
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleViolation = (violationType: string) => {
    const newAttempts = cheatingAttempts + 1;
    setCheatingAttempts(newAttempts);
    setShowWarning(true);

    if (newAttempts >= MAX_VIOLATIONS) {
      setIsTerminated(true);
      setTimeout(() => handleSubmit(true), 3000);
    }
  };

  const handleContinueExam = () => {
    setShowWarning(false);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (cheated = false) => {
    setIsExamActive(false);
    
    try {
      const response = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          cheatingAttempts,
          terminatedForCheating: cheated || isTerminated
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/student/result/${data.score.id}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="exam-session bg-background min-h-screen flex flex-col">
      <CheatingDetector onViolation={handleViolation} isActive={isExamActive} />
      <CheatingWarningModal
        isOpen={showWarning}
        violationCount={cheatingAttempts}
        maxViolations={MAX_VIOLATIONS}
        onContinue={handleContinueExam}
        onTerminate={() => handleSubmit(true)}
        isTerminated={isTerminated}
      />

      {/* Header */}
      <div className="border-b border-border bg-muted-lighter/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
            <p className="text-muted text-sm">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
          </div>
          <div className={`text-3xl font-bold font-mono ${timeRemaining < 300 ? 'text-error' : 'text-foreground'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Question Navigator */}
        <aside className="w-56 border-r border-border bg-muted-lighter/30 p-4 overflow-y-auto">
          <h3 className="font-semibold text-foreground mb-4">Questions</h3>
          <div className="grid grid-cols-4 gap-2">
            {exam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-10 rounded text-sm font-medium transition ${
                  idx === currentQuestionIndex
                    ? 'bg-primary text-white'
                    : answers[exam.questions[idx]._id]
                    ? 'bg-success/20 text-success'
                    : 'bg-input border border-border text-muted hover:bg-muted-lighter'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border bg-muted-lighter/30 p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {currentQuestion.questionText}
              </h2>

              {/* Question Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.type === 'true_false' || currentQuestion.type === 'single_choice' ? (
                  Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label key={key} className="flex items-center p-4 rounded border border-border bg-input cursor-pointer hover:bg-muted-lighter transition">
                      <input
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        value={key}
                        checked={answers[currentQuestion._id] === key}
                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-foreground">{value}</span>
                    </label>
                  ))
                ) : (
                  Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label key={key} className="flex items-center p-4 rounded border border-border bg-input cursor-pointer hover:bg-muted-lighter transition">
                      <input
                        type="checkbox"
                        checked={(answers[currentQuestion._id] || []).includes(key)}
                        onChange={(e) => {
                          const current = answers[currentQuestion._id] || [];
                          if (e.target.checked) {
                            handleAnswerChange(currentQuestion._id, [...current, key]);
                          } else {
                            handleAnswerChange(currentQuestion._id, current.filter((c: string) => c !== key));
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-foreground">{value}</span>
                    </label>
                  ))
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-4 justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="bg-muted-lighter hover:bg-muted-lighter/80 text-foreground disabled:opacity-50"
                >
                  Previous
                </Button>

                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button
                    onClick={() => handleSubmit()}
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary-dark text-white"
                  >
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
