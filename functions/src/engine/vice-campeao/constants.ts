export const VICE_CAMPEAO_PHASES = {
  SETUP: 'SETUP',
  CARD_SELECTION: 'CARD_SELECTION',
  RUN: 'RUN',
  GAME_OVER: 'GAME_OVER',
} as const;

export const VICE_CAMPEAO_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

export const MAX_ROUNDS = 5;

export const STARTING_CARDS = 2;

export const CARD_PER_ROUND = 1;
