// components/exam/exam-interface.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheatingDetector } from './anti-cheating-detector';
import { CheatingWarningModal } from './cheating-warning-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, User, CheckCircle2, ChevronLeft, ChevronRight, Radio, Hash, ToggleLeft, Grip } from 'lucide-react';
import { Exam } from '../../lib/schemas/exam.schema';
import { ExamErrorBoundary } from './exam-error-boundary';

const MAX_VIOLATIONS = 3;

interface Question {
  _id: string;
  questionText: string;
  type: 'single_choice' | 'multiple_choice' | 'true_or_false' | 'drag_drop' | string;
  options: Record<string, string>;
  answer: string | string[];
}

interface Exam {
  _id: string;
  title: string;
  duration: number;
  questions: Question[];
  passingScore: number;
  scoreId?: string;
  attemptNumber?: number;
  numberOfQuestion?: number;
};
interface ExamInterfaceProps {
  examId?: string;
  studentName?: string;
}

const getQuestionTypeInfo = (type: string) => {
  switch (type) {
    case 'single_choice': return { label: 'Single Choice', icon: Radio, color: 'text-blue-600' };
    case 'multiple_choice': return { label: 'Multiple Choice', icon: Hash, color: 'text-purple-600' };
    case 'true_or_false': return { label: 'True/False', icon: ToggleLeft, color: 'text-green-600' };
    case 'drag_drop': return { label: 'Drag & Drop', icon: Grip, color: 'text-orange-600' };
    default: return { label: type.replace('_', ' ').toUpperCase(), icon: Hash, color: 'text-gray-600' };
  }
};

export async function ExamInterface({ examId, studentName = 'Student' }: ExamInterfaceProps) {
  const router = useRouter();


  let exam: Exam = {} as Exam;

  try {
    const res = await fetch(`/api/exam/${examId}`, {
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

  } catch (error: any) {
    console.log(error)
      return <ExamErrorBoundary message={error?.message} />
    }


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
    const [cheatingAttempts, setCheatingAttempts] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [isTerminated, setIsTerminated] = useState(false);
    const [isExamActive, setIsExamActive] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // SAFELY access current question
    const currentQuestion = exam.questions[currentQuestionIndex];
    const totalQuestions = exam.questions.length;
    const answeredCount = Object.keys(answers).length;
    const pendingCount = totalQuestions - answeredCount;
    const markedCount = markedForReview.size;

    // Prevent crash if exam or questions not loaded
    if (!exam || !exam.questions || exam.questions.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading exam...</p>
          </div>
        </div>
      );
    }

    useEffect(() => {
      const requestFullscreen = async () => {
        try { await document.documentElement.requestFullscreen(); } catch (err) { }
      };
      requestFullscreen();
      setIsExamActive(true);
    }, []);

    useEffect(() => {
      if (!isExamActive || timeRemaining <= 0) return;
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) { handleSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [isExamActive, timeRemaining]);

    // Auto-save progress
    useEffect(() => {
      const saveInterval = setInterval(() => {
        if (Object.keys(answers).length > 0 && isExamActive) {
          saveProgress();
        }
      }, 3000);

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

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
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
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const toggleMarkForReview = (questionId: string) => {
      setMarkedForReview(prev => {
        const newSet = new Set(prev);
        newSet.has(questionId) ? newSet.delete(questionId) : newSet.add(questionId);
        return newSet;
      });
    };

    const handleSubmit = async (cheated = false) => {
      setIsExamActive(false);
      setShowSubmitDialog(false);
      try {
        const response = await fetch('/api/student/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examId: exam._id,
            scoreId: exam.scoreId,
            answers: Object.entries(answers).map(([qId, ans]) => ({
              questionId: qId,
              selectedAnswer: ans,
            })),
            cheatingAttempts,
            terminatedForCheating: cheated || isTerminated,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          router.push(`/student/result/${data?.score?.id}`);
        }
      } catch (err) {
        console.error('Submit failed');
      }
    };

    const questionsByType = exam.questions.reduce((acc, q, i) => {
      const type = q.type || 'unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push({ q, i });
      return acc;
    }, {} as Record<string, { q: Question; i: number }[]>);

    return (
      <>
        <CheatingDetector onViolation={handleViolation} isActive={isExamActive} />
        <CheatingWarningModal
          isOpen={showWarning}
          violationCount={cheatingAttempts}
          maxViolations={MAX_VIOLATIONS}
          onContinue={() => setShowWarning(false)}
          onTerminate={() => handleSubmit(true)}
          isTerminated={isTerminated}
        />

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 antialiased">
          <div className="min-h-screen flex flex-col">
            {/* TOP BAR */}
            <header className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Candidate</p>
                      <p className="text-2xl font-bold text-gray-900">{studentName}</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
                    <p className="text-base text-gray-600">{totalQuestions} Questions • {exam.duration} Minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-600 tracking-wider">TIME REMAINING</p>
                    <p className={`text-5xl font-bold font-mono ${timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-blue-700'}`}>
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={() => setShowSubmitDialog(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-12 py-7 shadow-2xl rounded-xl"
                  >
                    Submit Exam
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex flex-1 relative">
              {/* COMPACT SIDEBAR */}
              <aside className={`absolute left-0 top-0 h-full bg-white border-r border-gray-200 shadow-2xl transition-all duration-300 z-40 ${sidebarOpen ? 'w-80' : 'w-20'}`}>
                <div className="absolute -right-8 top-24 z-50">
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-4 border-white"
                  >
                    {sidebarOpen ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                  </Button>
                </div>

                {sidebarOpen && (
                  <div className="p-6 h-full overflow-y-auto">
                    <h3 className="text-xl font-bold text-center mb-6 text-blue-800">Question Navigator</h3>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6 h-12 text-sm font-semibold">
                        <TabsTrigger value="all">All ({totalQuestions})</TabsTrigger>
                        <TabsTrigger value="answered">Ans ({answeredCount})</TabsTrigger>
                        <TabsTrigger value="pending">Pend ({pendingCount})</TabsTrigger>
                        <TabsTrigger value="marked">Mark ({markedCount})</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="mt-3">
                        <div className="space-y-6">
                          {Object.entries(questionsByType).map(([type, items]) => {
                            const filtered = items.filter(({ q }) => {
                              if (activeTab === 'all') return true;
                              if (activeTab === 'answered') return !!answers[q._id];
                              if (activeTab === 'pending') return !answers[q._id];
                              if (activeTab === 'marked') return markedForReview.has(q._id);
                              return true;
                            });

                            if (filtered.length === 0) return null;

                            const { label, icon: Icon, color } = getQuestionTypeInfo(type);

                            return (
                              <div key={type} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-300 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon className={`w-6 h-6 ${color}`} />
                                  <h4 className="text-sm font-bold text-gray-800">{label} ({filtered.length})</h4>
                                </div>

                                <div className="grid grid-cols-5 gap-3">
                                  {filtered.map(({ q, i }) => {
                                    const isCurrent = i === currentQuestionIndex;
                                    const isAnswered = !!answers[q._id];
                                    const isMarked = markedForReview.has(q._id);

                                    return (
                                      <button
                                        key={q._id}
                                        onClick={() => setCurrentQuestionIndex(i)}
                                        className={`relative w-full aspect-square rounded-xl font-bold text-2xl transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center text-white
                                        ${isCurrent
                                            ? 'bg-blue-600 ring-4 ring-blue-300'
                                            : isAnswered && isMarked
                                              ? 'bg-gradient-to-br from-green-500 to-yellow-500'
                                              : isAnswered
                                                ? 'bg-green-600'
                                                : isMarked
                                                  ? 'bg-yellow-500'
                                                  : 'bg-gray-500'
                                          }`}
                                      >
                                        {i + 1}
                                        {isMarked && !isCurrent && (
                                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full shadow-lg flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold">!</span>
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </aside>

              {/* MAIN CONTENT */}
              <main className={`flex-1 p-10 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-20'}`}>
                <div className="max-w-5xl mx-auto">
                  <Card className="shadow-3xl border-0 bg-white rounded-3xl overflow-hidden">
                    <div className="p-12">
                      <div className="flex justify-between items-center mb-10">
                        <Badge className="text-2xl px-10 py-5 bg-blue-100 text-blue-800 font-bold rounded-full shadow-lg">
                          Question {currentQuestionIndex + 1} of {totalQuestions}
                        </Badge>

                        {/* FIXED: Safe check before accessing _id */}
                        {currentQuestion && markedForReview.has(currentQuestion._id) && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-4 border-yellow-500 font-bold text-xl px-8 py-4 rounded-full shadow-lg">
                            <AlertCircle className="w-7 h-7 mr-3" />
                            Marked for Review
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-4xl font-bold text-gray-900 leading-relaxed mb-16">
                        {currentQuestion.questionText}
                      </h2>

                      {/* Rest of your options rendering remains the same */}
                      <div className="space-y-8">
                        {currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_or_false' ? (
                          Object.entries(currentQuestion.options).map(([key, value]) => {
                            const isSelected = answers[currentQuestion._id] === key;
                            return (
                              <label
                                key={key}
                                className={`flex items-center p-10 border-4 rounded-3xl cursor-pointer transition-all hover:shadow-2xl relative group ${isSelected
                                  ? 'border-blue-600 bg-blue-50 shadow-2xl ring-4 ring-blue-200'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name={currentQuestion._id}
                                  value={key}
                                  checked={isSelected}
                                  onChange={() => handleAnswerChange(currentQuestion._id, key)}
                                  className="w-9 h-9 text-blue-600"
                                />
                                <span className="ml-8 text-2xl font-medium text-gray-800">{value}</span>
                                {isSelected && <CheckCircle2 className="absolute right-10 w-14 h-14 text-blue-600" />}
                              </label>
                            );
                          })
                        ) : (
                          Object.entries(currentQuestion.options).map(([key, value]) => {
                            const isSelected = (answers[currentQuestion._id] || []).includes(key);
                            return (
                              <label
                                key={key}
                                className={`flex items-center p-10 border-4 rounded-3xl cursor-pointer transition-all hover:shadow-2xl relative group ${isSelected
                                  ? 'border-blue-600 bg-blue-50 shadow-2xl ring-4 ring-blue-200'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const current = answers[currentQuestion._id] || [];
                                    const newAnswers = e.target.checked
                                      ? [...current, key]
                                      : current.filter((k: string) => k !== key);
                                    handleAnswerChange(currentQuestion._id, newAnswers);
                                  }}
                                  className="w-9 h-9 text-blue-600 rounded-lg"
                                />
                                <span className="ml-8 text-2xl font-medium text-gray-800">{value}</span>
                                {isSelected && <CheckCircle2 className="absolute right-10 w-14 h-14 text-blue-600" />}
                              </label>
                            );
                          })
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-20 pt-12 border-t-4 border-gray-200">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => currentQuestion && toggleMarkForReview(currentQuestion._id)}
                          className="text-xl font-bold px-12 py-8 border-4 rounded-2xl"
                        >
                          {currentQuestion && markedForReview.has(currentQuestion._id) ? 'Unmark Review' : 'Mark for Review'}
                        </Button>

                        <div className="flex gap-8">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="text-xl font-bold px-16 py-8 border-4 rounded-2xl"
                          >
                            Previous
                          </Button>
                          {currentQuestionIndex < totalQuestions - 1 ? (
                            <Button
                              size="lg"
                              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-20 py-8 rounded-2xl shadow-2xl"
                            >
                              Next Question
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              variant="destructive"
                              onClick={() => setShowSubmitDialog(true)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-20 py-8 rounded-2xl shadow-2xl"
                            >
                              Submit Exam
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </main>
            </div>

            {/* Submit Dialog */}
            {showSubmitDialog && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <Card className="max-w-2xl p-16 bg-white shadow-4xl rounded-3xl">
                  <h3 className="text-5xl font-bold text-center mb-12 text-gray-900">Submit Your Exam?</h3>
                  <div className="grid grid-cols-2 gap-8 text-center text-2xl mb-16">
                    <div className="bg-gray-100 p-8 rounded-2xl"><strong className="text-gray-700">Total:</strong> <span className="text-4xl font-bold">{totalQuestions}</span></div>
                    <div className="bg-green-100 p-8 rounded-2xl"><strong className="text-green-700">Answered:</strong> <span className="text-4xl font-bold text-green-600">{answeredCount}</span></div>
                    <div className="bg-orange-100 p-8 rounded-2xl"><strong className="text-orange-700">Pending:</strong> <span className="text-4xl font-bold text-orange-600">{pendingCount}</span></div>
                    <div className="bg-yellow-100 p-8 rounded-2xl"><strong className="text-yellow-700">Marked:</strong> <span className="text-4xl font-bold text-yellow-600">{markedCount}</span></div>
                  </div>
                  <div className="flex gap-12">
                    <Button variant="outline" size="lg" onClick={() => setShowSubmitDialog(false)} className="flex-1 text-2xl py-10 font-bold border-4 rounded-2xl">
                      Continue Exam
                    </Button>
                    <Button variant="destructive" size="lg" onClick={() => handleSubmit()} className="flex-1 text-2xl py-10 font-bold bg-red-600 hover:bg-red-700 rounded-2xl shadow-2xl">
                      Yes, Submit Now
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }