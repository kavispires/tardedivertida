/**
 * Phase identifiers used by the `sinais-de-alerta` engine.
 */
export const SINAIS_DE_ALERTA_PHASES = {
  SETUP: 'SETUP',
  DRAWING: 'DRAWING',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `sinais-de-alerta` engine.
 */
export const SINAIS_DE_ALERTA_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_EVALUATION: 'SUBMIT_EVALUATION',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;
/**
 * The number of candidate cards offered for a drawing prompt.
 */
export const TABLE_CARDS = 2;
/**
 * The standard drawing time limit in seconds.
 */
export const NORMAL_TIME_LIMIT = 30;
/**
 * The drawing time limit in seconds when the longer-timer option is enabled.
 */
export const LONGER_TIME_LIMIT = 60;
