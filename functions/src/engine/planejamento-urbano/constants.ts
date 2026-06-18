export const PLANEJAMENTO_URBANO_PHASES = {
  SETUP: 'SETUP',
  PLANNING: 'PLANNING',
  PLACING: 'PLACING',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

export const PLANEJAMENTO_URBANO_ACTIONS = {
  SUBMIT_PLANNING: 'SUBMIT_PLANNING',
  SUBMIT_PLACEMENTS: 'SUBMIT_PLACEMENTS',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

export const TOTAL_ROUNDS = 6;
export const LOCATIONS_PER_ROUND = 3;
export const CITY_BOUNDS_SIZE = 7;

export const ARCHITECT_MATCH_POINTS = 3;
export const ARCHITECT_PASSIVE_POINTS = 1;
export const PLAYER_MATCH_POINTS = 1;

export const CONES = ['A', 'B', 'C', 'D'] as const;
