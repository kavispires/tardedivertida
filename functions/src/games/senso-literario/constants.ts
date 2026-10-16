/**
 * Phase identifiers used by the `senso-literario` engine.
 */
export const SENSO_LITERARIO_PHASES = {
  SETUP: 'SETUP',
  PATTERN_CREATION: 'PATTERN_CREATION',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `senso-literario` engine.
 */
export const SENSO_LITERARIO_ACTIONS = {
  SUBMIT_PATTERN: 'SUBMIT_PATTERN',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;

/**
 * Genre identifiers or definitions used to build game content.
 */
export const GENRES = ['childrens', 'romance', 'technical'];
/**
 * The colors available for book-card patterns.
 */
export const COLORS = ['red', 'blue', 'yellow'];
/**
 * Initial letters available for book-card patterns.
 */
export const BOOK_INITIALS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Points awarded for a correct book-pattern guess.
 */
export const POINTS_PER_GUESS = 1;
/**
 * Bonus points awarded for completing a matching set.
 */
export const BONUS_POINT_FOR_SET = 1;
