/**
 * Phase identifiers used by the `cruza-palavras` engine.
 */
export const CRUZA_PALAVRAS_PHASES = {
  SETUP: 'SETUP',
  WORDS_SELECTION: 'WORDS_SELECTION',
  CLUE_WRITING: 'CLUE_WRITING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `cruza-palavras` engine.
 */
export const CRUZA_PALAVRAS_ACTIONS = {
  SUBMIT_WORDS: 'SUBMIT_WORDS',
  SUBMIT_CLUE: 'SUBMIT_CLUE',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 8,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 6;

/**
 * Word counts for each grid coordinate indexed by player count.
 */
export const WORDS_PER_COORDINATE = {
  3: 4,
  4: 4,
  5: 5,
  6: 5,
  7: 6,
  8: 6,
};
