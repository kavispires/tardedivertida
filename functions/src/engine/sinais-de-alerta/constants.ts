export const SINAIS_DE_ALERTA_PHASES = {
  SETUP: 'SETUP',
  DRAWING: 'DRAWING',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
} as const;

export const SINAIS_DE_ALERTA_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_EVALUATION: 'SUBMIT_EVALUATION',
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

export const TOTAL_ROUNDS = 5;
export const TABLE_CARDS = 2;
export const NORMAL_TIME_LIMIT = 30;
export const LONGER_TIME_LIMIT = 60;
