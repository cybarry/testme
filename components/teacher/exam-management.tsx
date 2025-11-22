'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  numberOfQuestion: number;
  passingScore: number;
  published: boolean;
  createdAt: string;
  maxAttempts: number;
}

interface QuestionBank {
  _id: string;
  name: string;
}

export function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDesc, setNewExamDesc] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [duration, setDuration] = useState(60);
  const [numberOfQuestion, setNumberOfQuestion] = useState(60);
  const [passingScore, setPassingScore] = useState(600);
  const [maxAttempts, setMaxAttempts] = useState(3);

  useEffect(() => {
    fetchExams();
    fetchBanks();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/teacher/exams');
      const data = await response.json();
      setExams(data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch('/api/teacher/banks');
      const data = await response.json();
      setBanks(data.banks || []);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankId) return;

    try {
      const response = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newExamTitle,
          description: newExamDesc,
          bankId: selectedBankId,
          duration,
          numberOfQuestion,
          passingScore,
          maxAttempts,
        })
      });

      if (response.ok) {
        setNewExamTitle('');
        setNewExamDesc('');
        setSelectedBankId('');
        setDuration(60);
        fetchExams();
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  const handlePublishExam = async (examId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/teacher/exams/${examId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      });

      if (response.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error('Failed to publish exam:', error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const response = await fetch(`/api/teacher/exams/${examId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }

  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Create Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <Input
              placeholder="Exam title"
              value={newExamTitle}
              onChange={(e) => setNewExamTitle(e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />

            <Input
              placeholder="Description (optional)"
              value={newExamDesc}
              onChange={(e) => setNewExamDesc(e.target.value)}
              className="bg-input border-border text-foreground"
            />

            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
              required
            >
              <option value="">Select question bank</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </select>

            <h3 className="text-lg font-semibold text-foreground">Exam Settings</h3>

            <div>
              <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Number of Questions</label>
              <Input
                type="number"
                placeholder="Set number of questions"
                value={numberOfQuestion}
                onChange={(e) => setNumberOfQuestion(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Passing Score</label>
              <Input
                type="number"
                placeholder="Passing Score"
                value={passingScore}
                onChange={(e) => setPassingScore(Math.min(1000, Math.max(0, Number(e.target.value))))}
                max="1000"
                min="0"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Maximum Attempts</label>
              <Input
                type="number"
                placeholder="Maximum Attempts"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
              Create Exam
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted">Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-muted">No exams created</p>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="flex items-center justify-between p-4 rounded-md bg-input border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{exam.title}</p>
                    <div className="space-y-1 mt-2">
                      <p className="text-sm">
                        <span className="text-muted">Duration:</span> <span className="text-foreground">{exam.duration} minutes</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted">Questions:</span> <span className="text-foreground">{exam.numberOfQuestion}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted">Passing Score:</span> <span className="text-foreground">{exam.passingScore}/1000</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted">Max Attempts:</span> <span className="text-foreground">{exam.maxAttempts}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handlePublishExam(exam._id, exam.published)}
                            className={exam.published ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}
                          >
                            {exam.published ? 'Published' : 'Draft'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to {exam.published ? 'unpublish' : 'publish'} this exam
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteExam(exam._id)}
                            className="bg-error hover:bg-error/90"
                          >
                            Delete
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to delete this exam
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
