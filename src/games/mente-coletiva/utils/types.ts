// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { GroupQuestionCardData } from 'types/tdr';

/**
 * A group question with customizable parts
 */
export type Question = {
  /**
   * Unique identifier for the question
   */
  id: string;
  /**
   * Question number/index
   */
  number: number;
  /**
   * Text that comes before the blank
   */
  prefix: string;
  /**
   * Text that comes after the blank
   */
  suffix: string;
};

/**
 * A player's answer to a question
 */
export type AnswerEntry = {
  /**
   * Unique identifier for the answer
   */
  id: string;
  /**
   * Whether the answer is locked in for matching
   */
  isLocked: boolean;
  /**
   * The player who submitted this answer
   */
  playerId: UID;
  /**
   * The original answer text
   */
  answer: string;
  /**
   * Normalized/parsed version of the answer for comparison
   */
  parsedAnswer: string;
  /**
   * The score awarded for this answer
   */
  score: number;
};

/**
 * List of allowed actions or items
 */
export type AllowedList = PlainObject;

/**
 * Group of answers that match each other
 */
export type AnswerGroupObject = {
  /**
   * The answer text
   */
  answer: string;
  /**
   * Individual answer entries in this group
   */
  entries: AnswerEntry[];
  /**
   * Normalized/parsed version of the answer
   */
  parsedAnswer: string;
};

/**
 * Payload for submitting a selected question
 */
export type SubmitQuestionPayload = {
  /**
   * The ID of the selected question
   */
  questionId: string;
};

/**
 * Payload for submitting a custom question
 */
export type SubmitCustomQuestionPayload = {
  /**
   * The custom question created by the player
   */
  customQuestion: Question;
};

/**
 * Payload for submitting answers
 */
export type SubmitAnswersPayload = {
  /**
   * Dictionary of answers keyed by question or answer ID
   */
  answers: Dictionary<string>;
};

/**
 * Payload for submitting the next round of answers
 */
export type SubmitNextAnswersPayload = {
  /**
   * List of allowed answers/actions
   */
  allowedList: PlainObject;
};

/**
 * Payload for adding an answer
 */
export type AddAnswerPayload = {
  /**
   * The answer to add
   */
  answer: AnswerEntry;
};

/**
 * Payload for next answers
 */
export type NextAnswersPayload = {
  /**
   * List of allowed answer IDs
   */
  allowedList: string[];
};

/**
 * Entry in the game gallery showing most frequent answers
 */
export type GalleryEntry = {
  /**
   * The question that was asked
   */
  question: GroupQuestionCardData;
  /**
   * The most frequent answers and who gave them
   */
  answers: {
    /**
     * Players who gave this answer
     */
    playerIds: UID[];
    /**
     * The answer text
     */
    answer: string;
  }[];
};

/**
 * Phase: Question Selection
 * Players see multiple questions and the active player selects one
 */
export type PhaseQuestionSelectionState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * The size threshold for pasture game over condition
   */
  pastureSize: number;
  /**
   * Type of round determining scoring rules
   */
  roundType: number;
  /**
   * The player who selects the question for this round
   */
  activePlayerId: UID;
  /**
   * Array of questions to choose from
   */
  currentQuestions: GroupQuestionCardData[];
};

/**
 * Phase: Everybody Writes
 * All players write answers to the selected question
 */
export type PhaseEverybodyWritesState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * The size threshold for pasture game over condition
   */
  pastureSize: number;
  /**
   * Type of round determining scoring rules
   */
  roundType: number;
  /**
   * The player who selected the question
   */
  activePlayerId: UID;
  /**
   * The current question everyone is answering
   */
  currentQuestion: GroupQuestionCardData;
};

/**
 * Phase: Compare
 * Players compare their answers and lock matching ones
 */
export type PhaseCompareState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * The size threshold for pasture game over condition
   */
  pastureSize: number;
  /**
   * Type of round determining scoring rules
   */
  roundType: number;
  /**
   * The player who selected the question
   */
  activePlayerId: UID;
  /**
   * The current question being answered
   */
  currentQuestion: GroupQuestionCardData;
  /**
   * Grouped list of answers showing matches
   */
  answersList: AnswerGroupObject[];
  /**
   * All individual answers from players
   */
  allAnswers: AnswerEntry[];
};

/**
 * Phase: Resolution
 * Shows results, scoring, and pasture changes
 */
export type PhaseResolutionState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * The size threshold for pasture game over condition
   */
  pastureSize: number;
  /**
   * Type of round determining scoring rules
   */
  roundType: number;
  /**
   * The player who selected the question
   */
  activePlayerId: UID;
  /**
   * Ranking of players for this round
   */
  ranking: GameRanking;
  /**
   * JSON string of pasture changes (left, center, right sections)
   */
  pastureChangeStr: string;
  /**
   * Whether the save mechanism has been used
   */
  usedSave: boolean;
  /**
   * Whether to announce the save this round
   */
  announceSave: boolean;
};

/**
 * Phase: Game Over
 * Final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Players who won (reached the end)
   */
  winners: GamePlayer[];
  /**
   * Players who lost (fell off the pasture)
   */
  losers: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Gallery of the most frequent answers for each question
   */
  gallery: GalleryEntry[];
};
