/**
 * Phase identifiers used by the `duetos` engine.
 */
export const DUETOS_PHASES = {
  SETUP: 'SETUP',
  PAIRING: 'PAIRING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `duetos` engine.
 */
export const DUETOS_ACTIONS = {
  SUBMIT_PAIRS: 'SUBMIT_PAIRS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;

/**
 * The number of pairs each player selects in a round.
 */
export const PAIRS_PER_ROUND = 4;

/**
 * Additional items included beyond the cards needed for the pairs.
 */
export const EXTRA_ITEMS = 2;

/**
 * The number of cards displayed in a normal pairing round.
 */
export const CARDS_PER_NORMAL_ROUND = 8;

/**
 * The number of cards displayed in a hard pairing round.
 */
export const CARDS_PER_HARD_ROUND = 9;

/**
 * The number of cards displayed in the final pairing round.
 */
export const CARDS_PER_FINAL_ROUND = 12;
