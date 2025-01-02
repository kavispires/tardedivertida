// Types
import type { TopicCard } from 'types/tdr';

export type SubmitGridAnswersPayload = {
  answers: StringDictionary;
  stop?: PlayerId;
};

export type SubmitRejectedAnswers = {
  evaluations: BooleanDictionary;
};

export type LetterEntry = {
  type: 'starts-with' | 'ends-with' | 'includes';
  letters: string;
  level: number;
};

export type AdedanhxGrid = {
  xHeaders: TopicCard[];
  yHeaders: LetterEntry[];
};

export type Answer = {
  id: string; // x-y
  answer: string;
  timestamp: number;
};

export type AnswerEvaluationEntry = {
  id: string;
  playerId: string;
  answer: string;
  timestamp: number;
  points: number;
  autoRejected: boolean;
  rejected: boolean;
};

export type GroupAnswerEvaluationEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  answers: AnswerEvaluationEntry[];
  points: number;
};

export type AnswerGridEntry = {
  id: string;
  main: {
    playerId: PlayerId;
    score: number;
    answer: string;
  };
  playerIds: PlayerId[];
  score: number;
};

export type AdedanhxGalleryEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  topAnswer?: AnswerGridEntry['main'];
};
