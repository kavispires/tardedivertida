/**
 * Phase identifiers used by the `galeria-de-sonhos` engine.
 */
export const GALERIA_DE_SONHOS_PHASES = {
  SETUP: 'SETUP',
  WORD_SELECTION: 'WORD_SELECTION',
  DREAMS_SELECTION: 'DREAMS_SELECTION',
  CARD_PLAY: 'CARD_PLAY',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `galeria-de-sonhos` engine.
 */
export const GALERIA_DE_SONHOS_ACTIONS = {
  SUBMIT_WORD: 'SUBMIT_WORD',
  SUBMIT_CARDS: 'SUBMIT_CARDS',
  PLAY_CARD: 'PLAY_CARD',
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
export const TOTAL_ROUNDS = 4;

/**
 * The number of image cards loaded for the table deck.
 */
export const TABLE_DECK_TOTAL = 30;

/**
 * The number of word cards loaded for the game.
 */
export const WORD_DECK_TOTAL = 10;

/**
 * The number of image cards displayed at the start of the game.
 */
export const INITIAL_TABLE_SIZE = 15;
