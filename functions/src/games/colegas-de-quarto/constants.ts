/**
 * Phase identifiers used by the `colegas-de-quarto` engine.
 */
export const COLEGAS_DE_QUARTO_PHASES = {
  SETUP: 'SETUP',
  WORDS_SELECTION: 'WORDS_SELECTION',
  CLUE_WRITING: 'CLUE_WRITING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `colegas-de-quarto` engine.
 */
export const COLEGAS_DE_QUARTO_ACTIONS = {
  SUBMIT_WORDS: 'SUBMIT_WORDS',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 3;

/**
 * The number of candidate words loaded for board generation.
 */
export const WORDS_IN_POOL = 20;

/**
 * Pair counts, board sizes, and happiness goals indexed by player count.
 */
export const SETTINGS_PER_PLAYER_COUNT = {
  2: {
    pairsToGuess: 2,
    totalWords: 9,
    happinessGoal: 20,
  },
  3: {
    pairsToGuess: 2,
    totalWords: 13,
    happinessGoal: 30,
  },
  4: {
    pairsToGuess: 1,
    totalWords: 9,
    happinessGoal: 32,
  },
  5: {
    pairsToGuess: 1,
    totalWords: 11,
    happinessGoal: 40,
  },
  6: {
    pairsToGuess: 1,
    totalWords: 13,
    happinessGoal: 48,
  },
};

/**
 * The reserved identifier used for the shared target entry.
 */
export const TARGET_ID = 'TARGET';

/**
 * Point values and thresholds used when resolving game results.
 */
export const POINTS = {
  CORRECT_TARGET: 3,
  CORRECT_GUESS: 2,
  GUESSED: 1,
};
