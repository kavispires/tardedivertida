export type SelectWitnessPayload = {
  witnessId: PlayerId;
};

export type SelectQuestionPayload = {
  questionId: string;
};

export type SubmitTestimonyPayload = {
  testimony: boolean;
};

export type EliminatePayload = {
  suspectId: string;
  pass: boolean;
};

export type Question = {
  id: string;
  question: string;
};

export type THistoryEntry = {
  id: string;
  question: string;
  answer: string;
  statement: boolean;
};

export type Status = {
  questions: number;
  totalTime: number;
  suspects: number;
  released: number;
  score: number;
};
