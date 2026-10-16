/**
 * Phase identifiers used by the `ta-na-cara` engine.
 */
export const TA_NA_CARA_PHASES = {
  SETUP: 'SETUP',
  PROMPT: 'PROMPT',
  ANSWERING: 'ANSWERING',
  GUESSING: 'GUESSING',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `ta-na-cara` engine.
 */
export const TA_NA_CARA_ACTIONS = {
  SUBMIT_PROMPT: 'SUBMIT_PROMPT',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  TRIGGER_GUESSING: 'TRIGGER_GUESSING',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 15;

/**
 * The number of characters included in the guessing pool.
 */
export const CHARACTER_COUNT = 24;

/**
 * The number of question suggestions requested from each player.
 */
export const PLAYER_SUGGESTED_QUESTIONS_COUNT = 3;
