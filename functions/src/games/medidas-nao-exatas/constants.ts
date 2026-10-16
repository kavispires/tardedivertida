/**
 * Phase identifiers used by the `medidas-nao-exatas` engine.
 */
export const MEDIDAS_NAO_EXATAS_PHASES = {
  SETUP: 'SETUP',
  METRICS_BUILDING: 'METRICS_BUILDING',
  GUESSING: 'GUESSING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `medidas-nao-exatas` engine.
 */
export const MEDIDAS_NAO_EXATAS_ACTIONS = {
  SUBMIT_POOL: 'SUBMIT_POOL',
  SUBMIT_METRICS: 'SUBMIT_METRICS',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
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
 * The number of candidate word cards allocated to each player.
 */
export const WORDS_PER_PLAYER = 10;
/**
 * The number of descriptor cards allocated to each player.
 */
export const DESCRIPTORS_PER_PLAYER = 10;
