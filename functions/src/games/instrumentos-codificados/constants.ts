/**
 * Phase identifiers used by the `instrumentos-codificados` engine.
 */
export const INSTRUMENTOS_CODIFICADOS_PHASES = {
  SETUP: 'SETUP',
  HINT_GIVING: 'HINT_GIVING',
  HINT_RECEIVING: 'HINT_RECEIVING',
  GUESS_THE_CODE: 'GUESS_THE_CODE',
  DISCUSSION: 'DISCUSSION',
  SOLUTION: 'SOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;

/**
 * The number of digits in each player's secret code.
 */
export const PLAYER_CODE_LENGTH = 3;

/**
 * Digits available for generating secret codes.
 */
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * The round at which players arrange the inferred code order.
 */
export const ORDER_ROUND = 6;

/**
 * The number of image-card resources selected for the game.
 */
export const TOTAL_IMAGE_CARDS = 10;

/**
 * Instrument identifiers used to distinguish player codes.
 */
export const INSTRUMENTS = [
  'guitar',
  'microphone',
  'drums',
  'bass',
  'keys',
  'sax',
  'violin',
  'tamborine',
  'triangle',
  'accordion',
];
