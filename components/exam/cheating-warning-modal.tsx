'use client';

import { Button } from '@/components/ui/button';

interface CheatingWarningModalProps {
  isOpen: boolean;
  violationCount: number;
  maxViolations: number;
  onContinue: () => void;
  onTerminate: () => void;
  isTerminated: boolean;
}

export function CheatingWarningModal({
  isOpen,
  violationCount,
  maxViolations,
  onContinue,
  onTerminate,
  isTerminated
}: CheatingWarningModalProps) {
  if (!isOpen) return null;

  const remainingAttempts = maxViolations - violationCount;
  const isWarning = remainingAttempts <= 0;

  return (
    <div className="cheating-warning">
      <div className="cheating-modal">
        {isWarning ? (
          <>
            <div className="mb-6">
              <p className="text-4xl mb-4">⚠️</p>
              <h2 className="text-2xl font-bold text-error mb-2">EXAM TERMINATED</h2>
              <p className="text-error font-semibold">Cheating Detected</p>
            </div>

            <p className="text-foreground mb-6 text-sm leading-relaxed">
              You have exceeded the allowed cheating attempts. Your exam is being submitted automatically with your current answers.
            </p>

            {isTerminated ? (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-error border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted text-sm">Submitting exam...</p>
              </div>
            ) : (
              <Button
                onClick={onTerminate}
                className="w-full bg-error hover:bg-error/90 text-white"
              >
                Submit Exam
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-4xl mb-4">⚠️</p>
              <h2 className="text-2xl font-bold text-error mb-2">CHEATING DETECTED</h2>
              <p className="text-error font-semibold">Suspicious Activity Detected</p>
            </div>

            <p className="text-foreground mb-4 text-sm">
              You have left the exam environment or attempted a prohibited action.
            </p>

            <div className="bg-error/10 border border-error/30 rounded p-3 mb-6">
              <p className="text-error text-center font-semibold">
                Attempts Remaining: {remainingAttempts}
              </p>
              <p className="text-muted text-center text-xs mt-1">
                {remainingAttempts === 1 && 'This is your final warning!'}
                {remainingAttempts === 2 && 'Two more violations will terminate the exam'}
              </p>
            </div>

            <Button
              onClick={onContinue}
              className="w-full bg-primary hover:bg-primary-dark text-white"
            >
              Continue Exam
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
