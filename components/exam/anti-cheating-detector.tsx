'use client';

import { useEffect, useRef } from 'react';
import { useExamStore } from '@/lib/zustand-store';
import { isBlocedKeyCombo } from '@/lib/blocked-keys';

interface CheatingDetectorProps {
  onViolation: (type: string) => void;
  isActive: boolean;
}

export function CheatingDetector({ onViolation, isActive }: CheatingDetectorProps) {
  const incrementCheatingAttempts = useExamStore((state) => state.incrementCheatingAttempts);
  const violationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) return;

    // Handle visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation('tab_switch');
        incrementCheatingAttempts();
      }
    };

    // Handle window blur (focus loss)
    const handleBlur = () => {
      onViolation('window_blur');
      incrementCheatingAttempts();
    };

    // Handle copy/paste/cut
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation('copy_paste_attempt');
      incrementCheatingAttempts();
    };

    // Handle right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViolation('right_click_attempt');
      incrementCheatingAttempts();
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlocedKeyCombo(e)) {
        e.preventDefault();
        onViolation('blocked_key_shortcut');
        incrementCheatingAttempts();
      }

      // Ctrl/Cmd + P (print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        onViolation('print_attempt');
        incrementCheatingAttempts();
      }
    };

    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onViolation('fullscreen_exit');
        incrementCheatingAttempts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive, onViolation, incrementCheatingAttempts]);

  return null;
}
