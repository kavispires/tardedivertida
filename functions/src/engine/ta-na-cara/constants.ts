export const TA_NA_CARA_PHASES = {
  SETUP: 'SETUP',
  PROMPT: 'PROMPT',
  ANSWERING: 'ANSWERING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

export const TA_NA_CARA_ACTIONS = {
  SUBMIT_PROMPT: 'SUBMIT_PROMPT',
  SUBMIT_TARGET: 'SUBMIT_TARGET',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

export const MAX_ROUNDS = 15;

export const MINIMUM_SUSPECTS = 12;

export const QUESTIONS_PER_PLAYER = 6;

export const DUMMY_ID = '__result';

export const BASE_POINTS = 10;

export const MINIMUM_POINTS = 1;
