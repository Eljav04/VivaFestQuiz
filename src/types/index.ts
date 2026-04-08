export interface SubmitQuizDto {
  name: string;
  totalRemainingSeconds: number;
  answers: ParticipantAnswerDto[];
}

export interface ParticipantAnswerDto {
  questionId: number;
  answerId: number;
}

export interface QuestionDto {
  id: number;
  title: string;
  answers: AnswerDto[];
}

export interface AnswerDto {
  id: number;
  title: string;
  isRight: boolean;
}

export interface ParticipantQuestionDto {
  id: number;
  title: string;
  answers: ParticipantAnswerOptionDto[];
}

export interface ParticipantAnswerOptionDto {
  id: number;
  title: string;
}

export interface QuizResultDto {
  id: number;
  name: string;
  points: number;
  completeTime: string;
}
