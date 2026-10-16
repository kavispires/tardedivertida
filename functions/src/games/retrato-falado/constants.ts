/**
 * Phase identifiers used by the `retrato-falado` engine.
 */
export const RETRATO_FALADO_PHASES = {
  SETUP: 'SETUP',
  COMPOSITE_SKETCH: 'COMPOSITE_SKETCH',
  EVALUATION: 'EVALUATION',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `retrato-falado` engine.
 */
export const RETRATO_FALADO_ACTIONS = {
  SUBMIT_ORIENTATION: 'SUBMIT_ORIENTATION',
  SUBMIT_SKETCH: 'SUBMIT_SKETCH',
  SUBMIT_VOTE: 'SUBMIT_VOTE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 4,
  MAX: 10,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;
