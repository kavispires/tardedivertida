/**
 * Phase identifiers used by the `onda-telepatica` engine.
 */
export const ONDA_TELEPATICA_PHASES = {
  SETUP: 'SETUP',
  DIAL_SIDES: 'DIAL_SIDES',
  DIAL_CLUE: 'DIAL_CLUE',
  GUESS: 'GUESS',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `onda-telepatica` engine.
 */
export const ONDA_TELEPATICA_ACTIONS = {
  SUBMIT_CATEGORY: 'SUBMIT_CATEGORY',
  SUBMIT_CLUE: 'SUBMIT_CLUE',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 20,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * The score threshold used to determine whether the game should end.
 */
export const GAME_OVER_SCORE_THRESHOLD = 10;

/**
 * The number of spectrum categories offered for each round.
 */
export const CATEGORIES_PER_ROUND = 2;
