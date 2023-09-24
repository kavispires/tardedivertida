import { ADEDANHX_ACHIEVEMENTS, ADEDANHX_ACTIONS } from './constants';

export type AdedanhxOptions = {
  /**
   * Removes a row and column from the grid
   */
  shortGrid: boolean;
};

export type LetterEntry = {
  type: 'starts-with' | 'ends-with' | 'includes';
  letters: string;
  level: number;
};

export type ResourceData = {
  allTopics: TopicCard[];
  allLetters: LetterEntry[];
};

export type Answer = {
  index: number;
  answer: string;
  timestamp: number;
  valid?: boolean;
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

export type GalleryEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  topAnswer?: AnswerGridEntry['main'];
};

export type AdedanhxAchievement = keyof typeof ADEDANHX_ACHIEVEMENTS;

export interface AdedanhxStore extends DefaultStore {
  [key: string]: any;
}

export interface AdedanhxState extends DefaultState {
  [key: string]: any;
}

export interface AdedanhxInitialState extends InitialState {
  store: AdedanhxStore;
  state: AdedanhxState;
}

export interface AdedanhxSubmitAction extends Payload {
  action: keyof typeof ADEDANHX_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | AdedanhxState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | AdedanhxStore;
