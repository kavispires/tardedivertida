// Types
import type { TopicCardData } from '../../types/tdr';
import type { ADEDANHX_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `adedanhx` session.
 */
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

/**
 * Letter rule and difficulty used to constrain answers for a grid column.
 */
export type LetterEntry = {
  /**
   * Whether answers must start with, end with, or contain the selected letters.
   */
  type: 'starts-with' | 'ends-with' | 'includes';
  /**
   * Letters that an answer must start with, end with, or contain.
   */
  letters: string;
  /**
   * The difficulty level of the letter constraint.
   */
  level: number;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Topic resources available for building the answer grid.
   */
  allTopics: TopicCardData[];
  /**
   * Letter constraints available for building the answer grid.
   */
  allLetters: LetterEntry[];
};

/**
 * A submitted answer with its grid position, submission time, and optional validation result.
 */
export type Answer = {
  /**
   * The position of this entry in its grid or ordered collection.
   */
  index: number;
  /**
   * The submitted answer or recorded response.
   */
  answer: string;
  /**
   * Submission time used to order or compare player answers.
   */
  timestamp: number;
  /**
   * Whether the submitted answer passed validation.
   */
  valid?: boolean;
};

/**
 * A player answer enriched with evaluation status and awarded points.
 */
export type AnswerEvaluationEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: string;
  /**
   * The submitted answer or recorded response.
   */
  answer: string;
  /**
   * Submission time used to order or compare player answers.
   */
  timestamp: number;
  /**
   * Points awarded to this submitted answer.
   */
  points: number;
  /**
   * Whether automatic validation rejected this answer.
   */
  autoRejected: boolean;
  /**
   * Whether this answer was rejected during evaluation.
   */
  rejected: boolean;
};

/**
 * Answers grouped by a shared topic and letter rule for evaluation.
 */
export type GroupAnswerEvaluationEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The topic constraining this group of answers.
   */
  topic: TopicCardData;
  /**
   * The letter rule or initial associated with this entry.
   */
  letter: LetterEntry;
  /**
   * Answers associated with this question or evaluation group.
   */
  answers: AnswerEvaluationEntry[];
  /**
   * Points awarded to this group of equivalent answers.
   */
  points: number;
};

/**
 * A scored answer group with its representative submission and participating players.
 */
export type AnswerGridEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The representative answer and player used to display this scored group.
   */
  main: {
    /**
     * Identifier of the player associated with this entry.
     */
    playerId: UID;
    /**
     * The score associated with this player, entry, or resolved result.
     */
    score: number;
    /**
     * The submitted answer or recorded response.
     */
    answer: string;
  };
  /**
   * Identifiers of the players associated with this entry.
   */
  playerIds: UID[];
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The topic constraining this group of answers.
   */
  topic: TopicCardData;
  /**
   * The letter rule or initial associated with this entry.
   */
  letter: LetterEntry;
  /**
   * The highest-scoring answer selected for the gallery.
   */
  topAnswer?: AnswerGridEntry['main'];
};

/**
 * Server-side data retained between phases of a `adedanhx` session.
 */
export interface AdedanhxStore extends DefaultStore<AdedanhxOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `adedanhx` session.
 */
export interface AdedanhxState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `adedanhx` session.
 */
export interface AdedanhxInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: AdedanhxStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: AdedanhxState;
}

/**
 * Player action payload accepted by the `adedanhx` engine.
 */
export interface AdedanhxSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ADEDANHX_ACTIONS;
}

/**
 * Firestore document data used when reading the `adedanhx` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & AdedanhxState;
/**
 * Firestore document data used when reading the `adedanhx` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & AdedanhxStore;
