/**
 * Phase identifiers used by the `detetives-imaginativos` engine.
 */
export const DETETIVES_IMAGINATIVOS_PHASES = {
  SETUP: 'SETUP',
  SECRET_CLUE: 'SECRET_CLUE',
  CARD_PLAY: 'CARD_PLAY',
  DEFENSE: 'DEFENSE',
  VOTING: 'VOTING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `detetives-imaginativos` engine.
 */
export const DETETIVES_IMAGINATIVOS_ACTIONS = {
  SUBMIT_CLUE: 'SUBMIT_CLUE',
  PLAY_CARD: 'PLAY_CARD',
  DEFEND: 'DEFEND',
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
 * The maximum number of cards retained in a player's hand.
 */
export const HAND_LIMIT = 8;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 6;
