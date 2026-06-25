export const CRUZA_PALAVRAS_PHASES = {
  SETUP: 'SETUP',
  WORDS_SELECTION: 'WORDS_SELECTION',
  CLUE_WRITING: 'CLUE_WRITING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

export const CRUZA_PALAVRAS_ACTIONS = {
  SUBMIT_WORDS: 'SUBMIT_WORDS',
  SUBMIT_CLUE: 'SUBMIT_CLUE',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 8,
} as const;

export const TOTAL_ROUNDS = 6;

export const WORDS_PER_COORDINATE = {
  3: 4,
  4: 4,
  5: 5,
  6: 5,
  7: 6,
  8: 6,
};
