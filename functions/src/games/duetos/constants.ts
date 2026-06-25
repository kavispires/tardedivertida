export const DUETOS_PHASES = {
  SETUP: 'SETUP',
  PAIRING: 'PAIRING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

export const DUETOS_ACTIONS = {
  SUBMIT_PAIRS: 'SUBMIT_PAIRS',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

export const TOTAL_ROUNDS = 5;

export const PAIRS_PER_ROUND = 4;

export const EXTRA_ITEMS = 2;

export const CARDS_PER_NORMAL_ROUND = 8;

export const CARDS_PER_HARD_ROUND = 9;

export const CARDS_PER_FINAL_ROUND = 12;
