// Types
import type { Achievement, GameRanking } from 'types/game';

/**
 * Represents a card in the Arte Ruim game
 */
export type ArteRuimCustomCard = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * Text content to be drawn
   */
  text: string;
  /**
   * Difficulty level of the card (1-5)
   */
  level: number;
  /**
   * Optional player ID if the card is assigned to a player
   */
  playerId?: UID;
};

/**
 * Represents a completed drawing in the game
 */
export type ArteRuimDrawing = {
  /**
   * Unique identifier for the drawing
   */
  id: string;
  /**
   * Base64 encoded drawing data
   */
  drawing: string;
  /**
   * ID of the player who created the drawing
   */
  playerId: UID;
  /**
   * The text that was supposed to be drawn
   */
  text: string;
  /**
   * Success rate of other players guessing correctly (0-1)
   */
  successRate?: number;
  /**
   * Difficulty level of the drawing
   */
  level: number;
};

/**
 * Maps card IDs to arrays of player IDs who voted for that card
 */
export type PlayersSay = {
  [key: string]: UID[];
};

/**
 * Represents a gallery window entry with voting results
 */
export type ArteRuimGalleryWindow = {
  /**
   * Correct answer card ID
   */
  id: string;
  /**
   * Original card ID (may include level 5 suffix)
   */
  originalId: string;
  /**
   * Base64 encoded drawing data
   */
  drawing: string;
  /**
   * ID of the player who drew this
   */
  artistId: UID;
  /**
   * Difficulty level of the drawing
   */
  level: number;
  /**
   * The text that was drawn
   */
  text: string;
  /**
   * Maps card IDs to arrays of player IDs who voted for that card
   */
  playersSay: Dictionary<UID[]>;
  /**
   * Maps player IDs to points earned in this round
   */
  playersPoints: Dictionary<number>;
  /**
   * Accuracy rate of guessing (correct guesses / total possible)
   */
  accuracy: number;
};

/**
 * @deprecated Use ArteRuimGalleryWindow instead
 */
export type ArteRuimWindow = {
  artistId: UID;
  correctAnswer: string;
  drawing: string;
  id: string;
  level: number;
  playersPoints?: Dictionary<number>;
  playersSay: PlayersSay;
  text: string;
};

/**
 * Payload for submitting a drawing
 */
export type SubmitDrawingPayload = {
  /**
   * Base64 encoded drawing data
   */
  drawing: string;
  /**
   * ID of the card that was drawn
   */
  cardId: string;
};

/**
 * Payload for submitting voting choices
 */
export type SubmitVotingPayload = {
  /**
   * Maps drawing IDs to voted card IDs
   */
  votes: PlainObject;
  /**
   * Whether the player chose randomly (via timer expiration)
   */
  choseRandomly: boolean;
};

// Phase State Types

/**
 * State for the Draw phase where players draw their cards
 */
export type PhaseDrawState = {
  /**
   * Score threshold to trigger game over (0 if not playing for points)
   */
  threshold: number;
  /**
   * Current difficulty level being played (1-5)
   */
  level: number;
  /**
   * Type of level: 'easy', 'medium', 'hard', 'themed', or special level type
   */
  levelType: string;
};

/**
 * State for the Evaluation phase where players vote on drawings
 */
export type PhaseEvaluationState = {
  /**
   * Score threshold to trigger game over (0 if not playing for points)
   */
  threshold: number;
  /**
   * Current difficulty level being played (1-5)
   */
  level: number;
  /**
   * Type of level: 'easy', 'medium', 'hard', 'themed', or special level type
   */
  levelType: string;
  /**
   * Shuffled array of cards for players to choose from
   */
  cards: ArteRuimCustomCard[];
  /**
   * Shuffled array of drawings to be evaluated
   */
  drawings: ArteRuimDrawing[];
};

/**
 * State for the Gallery phase where results are displayed
 */
export type PhaseGalleryState = {
  /**
   * Score threshold to trigger game over (0 if not playing for points)
   */
  threshold: number;
  /**
   * Current difficulty level that was played (1-5)
   */
  level: number;
  /**
   * Type of level: 'easy', 'medium', 'hard', 'themed', or special level type
   */
  levelType: string;
  /**
   * All cards from this round including table cards
   */
  cards: ArteRuimCustomCard[];
  /**
   * Gallery entries with voting results and points
   */
  gallery: ArteRuimGalleryWindow[];
  /**
   * Ranking of players for this round
   */
  ranking: GameRanking;
};

/**
 * State for the Game Over phase with final results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of player IDs who won the game
   */
  winners: UID[];
  /**
   * Final gallery of all drawings sorted by success rate
   */
  drawings: ArteRuimDrawing[];
  /**
   * All achievements earned during the game
   */
  achievements: Achievement[];
};
