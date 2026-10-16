/**
 * Phase identifiers used by the `metalinguagem` engine.
 */
export const METALINGUAGEM_PHASES = {
  SETUP: 'SETUP',
  WORD_CREATION: 'WORD_CREATION',
  GUESSING: 'GUESSING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `metalinguagem` engine.
 */
export const METALINGUAGEM_ACTIONS = {
  SUBMIT_WORD: 'SUBMIT_WORD',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 12;

/**
 * The number of items selected for each naming round.
 */
export const ITEMS_PER_ROUND = 9;

/**
 * Availability and resolution identifiers for word-length categories.
 */
export const WORD_LENGTH_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ENDANGERED: 'ENDANGERED',
  SOLVED: 'SOLVED',
  FAILED: 'FAILED',
} as const;
