import { create } from 'zustand';

export interface ExamState {
  examId: string | null;
  currentQuestionIndex: number;
  remainingTime: number;
  answers: Record<string, any>;
  cheatingAttempts: number;
  terminatedForCheating: boolean;

  setExamId: (id: string) => void;
  setCurrentQuestion: (index: number) => void;
  setRemainingTime: (time: number) => void;
  recordAnswer: (questionId: string, answer: any) => void;
  incrementCheatingAttempts: () => void;
  setTerminatedForCheating: (terminated: boolean) => void;
  resetExamState: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  examId: null,
  currentQuestionIndex: 0,
  remainingTime: 0,
  answers: {},
  cheatingAttempts: 0,
  terminatedForCheating: false,

  setExamId: (id: string) => set(() => ({ examId: id })),
  setCurrentQuestion: (index: number) => set({ currentQuestionIndex: index }),
  setRemainingTime: (time: number) => set({ remainingTime: time }),
  recordAnswer: (questionId: string, answer: any) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    })),
  incrementCheatingAttempts: () =>
    set((state) => ({
      cheatingAttempts: state.cheatingAttempts + 1
    })),
  setTerminatedForCheating: (terminated: boolean) =>
    set({ terminatedForCheating: terminated }),
  resetExamState: () =>
    set({
      examId: null,
      currentQuestionIndex: 0,
      remainingTime: 0,
      answers: {},
      cheatingAttempts: 0,
      terminatedForCheating: false
    })
}));

export interface AuthState {
  user: { id: string; role: 'admin' | 'teacher' | 'student' } | null;
  isLoading: boolean;

  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null })
}));
