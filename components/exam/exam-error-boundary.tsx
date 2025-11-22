'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ExamErrorBoundaryProps {
  message?: string;
}

export function ExamErrorBoundary({ message }: ExamErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="text-center p-10 max-w-lg">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Exam Not Available</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {message || 'The exam you are trying to access is not available or has been closed.'}
        </p>
        <Button
          size="lg"
          onClick={() => window.location.href = '/student/dashboard'}
          className="bg-primary hover:bg-primary/90"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}