export const TREVO_DA_SORTE_PHASES = {
  WORD_SELECTION: 'WORD_SELECTION',
  CLOVER_WRITING: 'CLOVER_WRITING',
  CLOVER_GUESSING: 'CLOVER_GUESSING',
  RESULTS: 'RESULTS',
};

export const TREVO_DA_SORTE_ACTIONS = {
  SUBMIT_BAD_WORDS: 'SUBMIT_BAD_WORDS',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

export const ROTATIONS = [0, 90, 180, 270];

export const WORST_TO_REMOVE = 6;

export const FIRST_ATTEMPT_SCORE = 3;

export const SECOND_ATTEMPT_SCORE = 1;

export const LEAVES_ORDER = ['A', 'B', 'C', 'D'];

export const DIRECTIONS_INDEXES = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};
