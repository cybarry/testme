'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { io } from 'socket.io-client';

interface StudentSession {
  studentId: string;
  questionIndex: number;
  cheatingAttempts: number;
  lastUpdate: string;
}

interface ExamMonitoringProps {
  examId: string;
}

export function ExamMonitoring({ examId }: ExamMonitoringProps) {
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

    socket.on('connect', () => {
      socket.emit('exam:monitor-join', { examId });
    });

    socket.on('exam:current-sessions', (data) => {
      setSessions(data);
    });

    socket.on('exam:student-progress', (data) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.studentId === data.studentId
            ? {
                ...s,
                questionIndex: data.questionIndex,
                cheatingAttempts: data.cheatingAttempts,
                lastUpdate: new Date().toLocaleTimeString()
              }
            : s
        )
      );
    });

    socket.on('exam:violation', (data) => {
      setViolations((prev) => [data, ...prev.slice(0, 4)]);
    });

    return () => {
      socket.disconnect();
    };
  }, [examId]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.studentId} className="p-3 rounded bg-input border border-border">
                  <p className="font-medium text-foreground text-sm">{session.studentId}</p>
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>Q: {session.questionIndex + 1}</span>
                    <span className={session.cheatingAttempts > 0 ? 'text-error' : ''}>
                      Violations: {session.cheatingAttempts}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{session.lastUpdate}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {violations.length === 0 ? (
            <p className="text-muted">No violations detected</p>
          ) : (
            <div className="space-y-2">
              {violations.map((v, idx) => (
                <div key={idx} className="p-2 rounded bg-error/10 border border-error/30 text-xs">
                  <p className="font-medium text-error">{v.violationType}</p>
                  <p className="text-muted">{v.studentId}</p>
                  <p className="text-muted">{new Date(v.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
