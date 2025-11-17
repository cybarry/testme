'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeWebSocket(token: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000', {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket error:', error);
  });

  return socket;
}

export function getWebSocket(): Socket | null {
  return socket;
}

export function disconnectWebSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function emitExamStart(examId: string) {
  socket?.emit('exam:start', { examId });
}

export function emitProgress(examId: string, questionIndex: number, cheatingAttempts: number) {
  socket?.emit('exam:progress', { examId, questionIndex, cheatingAttempts });
}

export function emitCheatingDetected(examId: string, violationType: string, attemptCount: number) {
  socket?.emit('exam:cheating-detected', { examId, violationType, attemptCount });
}

export function emitHeartbeat() {
  socket?.emit('exam:heartbeat');
}

export function onHeartbeatAck(callback: () => void) {
  socket?.on('exam:heartbeat-ack', callback);
}

export function onAutoSubmitTriggered(callback: (data: any) => void) {
  socket?.on('exam:auto-submit-triggered', callback);
}

export function onProgressUpdate(callback: (data: any) => void) {
  socket?.on('exam:student-progress', callback);
}

export function onViolationDetected(callback: (data: any) => void) {
  socket?.on('exam:violation', callback);
}
