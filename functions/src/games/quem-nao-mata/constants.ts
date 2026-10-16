/**
 * Phase identifiers used by the `quem-nao-mata` engine.
 */
export const QUEM_NAO_MATA_PHASES = {
  SETUP: 'SETUP',
  TARGETING: 'TARGETING',
  STANDOFF: 'STANDOFF',
  DUEL: 'DUEL',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `quem-nao-mata` engine.
 */
export const QUEM_NAO_MATA_ACTIONS = {
  SUBMIT_TARGET: 'SUBMIT_TARGET',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  SUBMIT_DECISION: 'SUBMIT_DECISION',
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
