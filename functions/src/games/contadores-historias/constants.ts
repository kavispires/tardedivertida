/**
 * Phase identifiers used by the `contadores-historias` engine.
 */
export const CONTADORES_HISTORIAS_PHASES = {
  SETUP: 'SETUP',
  STORY: 'STORY',
  CARD_PLAY: 'CARD_PLAY',
  VOTING: 'VOTING',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `contadores-historias` engine.
 */
export const CONTADORES_HISTORIAS_ACTIONS = {
  SUBMIT_STORY: 'SUBMIT_STORY',
  PLAY_CARD: 'PLAY_CARD',
  SUBMIT_VOTE: 'SUBMIT_VOTE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The number of cards allocated to each player's deck.
 */
export const CARDS_PER_PLAYER = 30;

/**
 * The maximum number of cards retained in a player's hand.
 */
export const HAND_LIMIT = 10;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * The score threshold used to determine whether the game should end.
 */
export const GAME_OVER_SCORE_THRESHOLD = 20;

/**
 * Extra table-card counts indexed by the number of players.
 */
export const TABLE_CARDS_BY_PLAYER_COUNT = {
  3: 3,
  4: 2,
  5: 2,
  6: 1,
  7: 1,
  8: 0,
  9: 0,
  10: 0,
};

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  NORMAL: 'NORMAL',
  EVERYBODY_GOT: 'EVERYBODY_GOT',
  NOBODY_GOT: 'NOBODY_GOT',
};
