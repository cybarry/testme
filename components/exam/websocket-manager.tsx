'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/lib/zustand-store';
import {
  initializeWebSocket,
  emitProgress,
  emitCheatingDetected,
  emitHeartbeat,
  onAutoSubmitTriggered,
  disconnectWebSocket
} from '@/lib/websocket-client';

interface WebSocketManagerProps {
  token: string;
  examId: string;
  questionIndex: number;
  cheatingAttempts: number;
  onAutoSubmitNeeded: () => void;
}

export function WebSocketManager({
  token,
  examId,
  questionIndex,
  cheatingAttempts,
  onAutoSubmitNeeded
}: WebSocketManagerProps) {
  useEffect(() => {
    const socket = initializeWebSocket(token);

    // Emit progress every 10 seconds
    const progressInterval = setInterval(() => {
      emitProgress(examId, questionIndex, cheatingAttempts);
    }, 10000);

    // Emit heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      emitHeartbeat();
    }, 30000);

    // Listen for auto-submit trigger
    const unsubscribe = onAutoSubmitTriggered((data) => {
      console.log('Auto-submit triggered:', data);
      onAutoSubmitNeeded();
    });

    return () => {
      clearInterval(progressInterval);
      clearInterval(heartbeatInterval);
      disconnectWebSocket();
    };
  }, [token, examId, questionIndex, cheatingAttempts, onAutoSubmitNeeded]);

  return null;
}
