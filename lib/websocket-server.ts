import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '@/lib/auth';

interface ExamSession {
  studentId: string;
  examId: string;
  socketId: string;
  cheatingAttempts: number;
  lastHeartbeat: number;
}

const examSessions = new Map<string, ExamSession>();
const socketToExamSession = new Map<string, string>();

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket: Socket) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      socket.disconnect();
      return;
    }

    socket.on('exam:start', (data: { examId: string }) => {
      const sessionId = `${decoded.userId}-${data.examId}`;
      const session: ExamSession = {
        studentId: decoded.userId,
        examId: data.examId,
        socketId: socket.id,
        cheatingAttempts: 0,
        lastHeartbeat: Date.now()
      };

      examSessions.set(sessionId, session);
      socketToExamSession.set(socket.id, sessionId);

      // Notify room about new student
      io.to(`exam-${data.examId}`).emit('exam:student-joined', {
        studentId: decoded.userId,
        timestamp: Date.now()
      });

      socket.join(`exam-${data.examId}`);
    });

    socket.on('exam:progress', (data: { examId: string; questionIndex: number; cheatingAttempts: number }) => {
      const sessionId = socketToExamSession.get(socket.id);
      if (sessionId && examSessions.has(sessionId)) {
        const session = examSessions.get(sessionId)!;
        session.cheatingAttempts = data.cheatingAttempts;
        session.lastHeartbeat = Date.now();

        // Broadcast to teachers/admins monitoring this exam
        io.to(`exam-monitor-${data.examId}`).emit('exam:student-progress', {
          studentId: decoded.userId,
          questionIndex: data.questionIndex,
          cheatingAttempts: data.cheatingAttempts,
          timestamp: Date.now()
        });
      }
    });

    socket.on('exam:cheating-detected', (data: { examId: string; violationType: string; attemptCount: number }) => {
      const sessionId = socketToExamSession.get(socket.id);
      if (sessionId && examSessions.has(sessionId)) {
        const session = examSessions.get(sessionId)!;
        session.cheatingAttempts = data.attemptCount;

        io.to(`exam-monitor-${data.examId}`).emit('exam:violation', {
          studentId: decoded.userId,
          violationType: data.violationType,
          attemptCount: data.attemptCount,
          timestamp: Date.now()
        });

        if (data.attemptCount >= 3) {
          io.to(socket.id).emit('exam:auto-submit-triggered', {
            reason: 'Excessive cheating attempts',
            timestamp: Date.now()
          });
        }
      }
    });

    socket.on('exam:heartbeat', () => {
      const sessionId = socketToExamSession.get(socket.id);
      if (sessionId && examSessions.has(sessionId)) {
        const session = examSessions.get(sessionId)!;
        session.lastHeartbeat = Date.now();
        socket.emit('exam:heartbeat-ack');
      }
    });

    socket.on('disconnect', () => {
      const sessionId = socketToExamSession.get(socket.id);
      if (sessionId) {
        const session = examSessions.get(sessionId);
        if (session) {
          io.to(`exam-${session.examId}`).emit('exam:student-left', {
            studentId: session.studentId,
            timestamp: Date.now()
          });
        }

        examSessions.delete(sessionId);
        socketToExamSession.delete(socket.id);
      }
    });

    socket.on('exam:monitor-join', (data: { examId: string }) => {
      socket.join(`exam-monitor-${data.examId}`);
      
      // Send current sessions
      const sessions = Array.from(examSessions.values()).filter(s => s.examId === data.examId);
      socket.emit('exam:current-sessions', sessions);
    });
  });

  return io;
}
