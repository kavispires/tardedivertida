// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';

/**
 * Category card for the current round
 */
export type CurrentCategory = {
  /**
   * Unique identifier for the category
   */
  id: string;
  /**
   * Left side label of the spectrum
   */
  left: string;
  /**
   * Right side label of the spectrum
   */
  right: string;
  /**
   * Optional clue provided by the psychic
   */
  clue?: string;
  /**
   * Optional target position on the spectrum (-10 to 10)
   */
  target?: number;
  /**
   * Optional ID of the psychic player
   */
  psychicId?: string;
};

/**
 * Payload for submitting a category selection
 */
export type SubmitCategoryPayload = {
  /**
   * ID of the selected category
   */
  categoryId: string;
};

/**
 * Payload for submitting a clue
 */
export type SubmitCluePayload = {
  /**
   * The clue text provided by the psychic
   */
  clue: string;
};

/**
 * Payload for submitting a guess
 */
export type SubmitGuessPayload = {
  /**
   * The guessed position on the spectrum (number or boolean)
   */
  guess: number | boolean;
};

/**
 * State for the dial clue phase where the psychic selects a category and provides a clue
 */
export type PhaseDialClueState = {
  /**
   * Order of players in the game
   */
  gameOrder: UID[];
  /**
   * ID of the current psychic player
   */
  psychicId: UID;
  /**
   * Available categories for this round
   */
  currentCategories: CurrentCategory[];
  /**
   * Target position on the spectrum for this round
   */
  target: number;
};

/**
 * State for the guess phase where players guess the target position
 */
export type PhaseGuessState = {
  /**
   * Order of players in the game
   */
  gameOrder: UID[];
  /**
   * ID of the current psychic player
   */
  psychicId: UID;
  /**
   * The selected category with clue and target
   */
  currentCategory: CurrentCategory;
};

/**
 * State for the reveal phase showing guess results
 */
export type PhaseRevealState = {
  /**
   * Order of players in the game
   */
  gameOrder: UID[];
  /**
   * ID of the current psychic player
   */
  psychicId: UID;
  /**
   * The selected category with clue and target
   */
  currentCategory: CurrentCategory;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * All categories used throughout the game with their clues and targets
   */
  pastCategories: CurrentCategory[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
