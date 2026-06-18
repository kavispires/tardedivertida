export const SENSO_LITERARIO_PHASES = {
  SETUP: 'SETUP',
  PATTERN_CREATION: 'PATTERN_CREATION',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

export const SENSO_LITERARIO_ACTIONS = {
  SUBMIT_PATTERN: 'SUBMIT_PATTERN',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

export const TOTAL_ROUNDS = 5;

export const GENRES = ['childrens', 'romance', 'technical'];
export const COLORS = ['red', 'blue', 'yellow'];
export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const POINTS_PER_GUESS = 1;
export const BONUS_POINT_FOR_SET = 1;
