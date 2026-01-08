export const COLEGAS_DE_QUARTO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  WORDS_SELECTION: 'WORDS_SELECTION',
  CLUE_WRITING: 'CLUE_WRITING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
};

export const COLEGAS_DE_QUARTO_ACTIONS = {
  SUBMIT_WORDS: 'SUBMIT_WORDS',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
};

export const COLEGAS_DE_QUARTO_ACHIEVEMENTS = {
  BEST_CLUES: 'BEST_CLUES',
  WORST_CLUES: 'WORST_CLUES',
  BEST_GUESSER: 'BEST_GUESSER',
  WORST_GUESSER: 'WORST_GUESSER',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
  SHORTEST_WORDS: 'SHORTEST_WORDS',
  LONGEST_WORDS: 'LONGEST_WORDS',
  SAVIOR: 'SAVIOR',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
};

export const TOTAL_ROUNDS = 3;

export const EXTRA_WORDS_IN_POOL = 5;

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

export const TARGET_ID = 'TARGET';

export const POINTS = {
  CORRECT_TARGET: 3,
  CORRECT_GUESS: 2,
  GUESSED: 1,
};
