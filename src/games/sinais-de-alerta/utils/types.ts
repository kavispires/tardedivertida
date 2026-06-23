// Types
import type { Achievement, GameRanking, GameRound } from 'types/game';
import type { TextCardData } from 'types/tdr';

/**
 * Payload for submitting a drawing
 */
export type SubmitDrawingPayload = {
  /**
   * The SVG drawing data
   */
  drawing: string;
};

/**
 * Payload for submitting evaluation guesses
 */
export type SubmitEvaluationPayload = {
  /**
   * Dictionary mapping card IDs to arrays of player IDs who match that card
   */
  guesses: Dictionary<UID[]>;
  /**
   * Whether the player used the random choice button
   */
  choseRandomly: boolean;
};

/**
 * Represents a drawing submission by a player
 */
export type DrawingEntryData = {
  /**
   * The ID of the player who created the drawing
   */
  playerId: UID;
  /**
   * The ID of the subject card used
   */
  subjectId: UID;
  /**
   * The ID of the descriptor card used
   */
  descriptorId: UID;
  /**
   * The SVG drawing data
   */
  drawing: string;
};

/**
 * Represents how players evaluated a drawing
 */
export type PlayersSay = {
  /**
   * IDs of players who made this guess
   */
  playersIds: UID[];
  /**
   * The subject ID they guessed
   */
  subjectId: UID;
  /**
   * The descriptor ID they guessed
   */
  descriptorId: UID;
  /**
   * Points awarded for this guess
   */
  score: number;
};

/**
 * Represents a drawing entry in the gallery with evaluation results
 */
export type GalleryEntry = {
  /**
   * Unique identifier for the gallery entry
   */
  id: string;
  /**
   * Combined title of subject and descriptor
   */
  title: string;
  /**
   * The ID of the subject card
   */
  subjectId: UID;
  /**
   * The ID of the descriptor card
   */
  descriptorId: UID;
  /**
   * The ID of the artist who created the drawing
   */
  artistId: UID;
  /**
   * Points earned by the artist
   */
  artistScore: number;
  /**
   * The SVG drawing data
   */
  drawing: string;
  /**
   * Collection of what players guessed for this drawing
   */
  playersSay: PlayersSay[];
  /**
   * Overall accuracy score (0-100)
   */
  accuracy: number;
  /**
   * Correctness score
   */
  correctness: number;
};

/**
 * Simplified gallery entry for final game over screen
 */
export type FinalGalleryEntry = {
  /**
   * Unique identifier for the entry
   */
  id: string;
  /**
   * Combined title of subject and descriptor
   */
  title: string;
  /**
   * The ID of the player who created the drawing
   */
  playerId: string;
  /**
   * The SVG drawing data
   */
  drawing: string;
  /**
   * Overall accuracy score (0-100)
   */
  accuracy: number;
};

/**
 * State for the Drawing phase where players create warning sign drawings
 * PhaseProps already includes: state, players, meta, user
 */
export type PhaseDrawingState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Time limit for the drawing phase in seconds
   */
  timeLimit: number;
  /**
   * Dictionary of subject and descriptor cards available this round
   */
  cards: Dictionary<TextCardData>;
};

/**
 * State for the Evaluation phase where players guess what others drew
 * PhaseProps already includes: state, players, meta, user
 */
export type PhaseEvaluationState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Time limit for the evaluation phase in seconds
   */
  timeLimit: number;
  /**
   * Dictionary of subject and descriptor cards available this round
   */
  cards: Dictionary<TextCardData>;
  /**
   * Shuffled array of subject card IDs for evaluation
   */
  subjectsIds: UID[];
  /**
   * Shuffled array of descriptor card IDs for evaluation
   */
  descriptorsIds: UID[];
  /**
   * All player drawings submitted this round
   */
  drawings: DrawingEntryData[];
};

/**
 * State for the Gallery phase showing results and scoring
 * PhaseProps already includes: state, players, meta, user
 */
export type PhaseGalleryState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Time limit for the phase in seconds
   */
  timeLimit: number;
  /**
   * Dictionary of subject and descriptor cards available this round
   */
  cards: Dictionary<TextCardData>;
  /**
   * Shuffled array of subject card IDs for evaluation
   */
  subjectsIds: UID[];
  /**
   * Shuffled array of descriptor card IDs for evaluation
   */
  descriptorsIds: UID[];
  /**
   * All player drawings submitted this round
   */
  drawings: DrawingEntryData[];
  /**
   * Gallery entries with evaluation results for this round
   */
  gallery: GalleryEntry[];
  /**
   * Player rankings for this round
   */
  ranking: GameRanking;
};

/**
 * State for the Game Over phase showing final results
 * PhaseProps already includes: state, players, meta, user
 */
export type PhaseGameOverState = {
  /**
   * Final round information
   */
  round: GameRound;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of player IDs who won the game
   */
  winners: UID[];
  /**
   * Complete gallery of all drawings from all rounds sorted by accuracy
   */
  gallery: FinalGalleryEntry[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
