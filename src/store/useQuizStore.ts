import { create } from 'zustand';
import { ParticipantAnswerDto } from '../types';

interface QuizState {
  participantName: string;
  totalRemainingSeconds: number;
  answers: ParticipantAnswerDto[];
  setParticipantName: (name: string) => void;
  addAnswer: (questionId: number, answerId: number, remainingSeconds: number) => void;
  resetQuizState: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  participantName: '',
  totalRemainingSeconds: 0,
  answers: [],
  setParticipantName: (name) => set({ participantName: name }),
  addAnswer: (questionId, answerId, remainingSeconds) => set((state) => ({
    answers: [...state.answers, { questionId, answerId }],
    totalRemainingSeconds: state.totalRemainingSeconds + remainingSeconds,
  })),
  resetQuizState: () => set({ participantName: '', totalRemainingSeconds: 0, answers: [] }),
}));
