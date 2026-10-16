/**
 * Phase identifiers used by the `vice-campeao` engine.
 */
export const VICE_CAMPEAO_PHASES = {
  SETUP: 'SETUP',
  CARD_SELECTION: 'CARD_SELECTION',
  RUN: 'RUN',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `vice-campeao` engine.
 */
export const VICE_CAMPEAO_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
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
export const MAX_ROUNDS = 5;

/**
 * The number of cards dealt to each player at setup.
 */
export const STARTING_CARDS = 3;

/**
 * The target number of cards kept in each runner's hand.
 */
export const DEFAULT_HAND_SIZE = 3;

/**
 * The number of runner cards drawn per round.
 */
export const CARD_PER_ROUND = 1;
