import type { TopicCardData } from '../../types/tdr';
import type { ADEDANHX_ACTIONS } from './constants';

export type AdedanhxOptions = {
  /**
   * How long the game will last (rounds)
   */
  shorterGame: boolean;
  /**
   * How many columns in the grid
   */
  columnSize: string;
  /**
   * How many rows in the grid
   */
  rowSize: string;
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

export type LetterEntry = {
  type: 'starts-with' | 'ends-with' | 'includes';
  letters: string;
  level: number;
};

export type ResourceData = {
  allTopics: TopicCardData[];
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
  topic: TopicCardData;
  letter: LetterEntry;
  answers: AnswerEvaluationEntry[];
  points: number;
};

export type AnswerGridEntry = {
  id: string;
  main: {
    playerId: UID;
    score: number;
    answer: string;
  };
  playerIds: UID[];
  score: number;
};

export type GalleryEntry = {
  id: string;
  topic: TopicCardData;
  letter: LetterEntry;
  topAnswer?: AnswerGridEntry['main'];
};

export interface AdedanhxStore extends DefaultStore<AdedanhxOptions> {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface AdedanhxState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface AdedanhxInitialState extends InitialState {
  store: AdedanhxStore;
  state: AdedanhxState;
}

export interface AdedanhxSubmitAction extends Payload {
  action: keyof typeof ADEDANHX_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & AdedanhxState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & AdedanhxStore;
