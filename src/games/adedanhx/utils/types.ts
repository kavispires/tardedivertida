// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { TopicCard } from 'types/tdr';

export type SubmitGridAnswersPayload = {
  answers: Dictionary<string>;
  stop?: UID;
};

export type SubmitRejectedAnswers = {
  evaluations: Dictionary<boolean>;
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
    playerId: UID;
    score: number;
    answer: string;
  };
  playerIds: UID[];
  score: number;
};

export type AdedanhxGalleryEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  topAnswer?: AnswerGridEntry['main'];
};

// Phase State Types

/**
 * State for the Answering phase
 */
export type PhaseAnsweringState = {
  /**
   * The current grid with topics and letters
   */
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop?: UID | false;
};

/**
 * State for the Evaluation phase
 */
export type PhaseEvaluationState = {
  /**
   * The current grid with topics and letters
   */
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop: boolean;
  /**
   * Grouped answers by cell for evaluation
   */
  answersGroups: GroupAnswerEvaluationEntry[];
  /**
   * Current index in the answers groups being evaluated
   */
  answersGroupIndex: number;
};

/**
 * State for the Results phase
 */
export type PhaseResultsState = {
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop: boolean;
  /**
   * Grouped answers by cell for evaluation
   */
  answersGroups: GroupAnswerEvaluationEntry[];
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
  /**
   * Grid of answers with scores
   */
  answersGrid: Dictionary<AnswerGridEntry>;
};

/**
 * State for the Game Over phase
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Winners of the game
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Top answers from all rounds
   */
  topAnswers: AdedanhxGalleryEntry[];
  /**
   * Cells with no answers from all rounds
   */
  noAnswers: AdedanhxGalleryEntry[];
};
