export const FILEIRA_DE_FATOS_PHASES = {
  SETUP: 'SETUP',
  ORDERING: 'ORDERING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

export const FILEIRA_DE_FATOS_ACTIONS = {
  SUBMIT_SCENARIO_ORDER: 'SUBMIT_SCENARIO_ORDER',
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 12,
} as const;

export const MAX_ROUNDS = 12;

export const SCENARIOS_PER_ROUND = 5;

export const ROUND_TYPES = [
  // Normal indicates 1 point per correct guess
  'NORMAL',
  'NORMAL',
  'NORMAL',
  'NORMAL',
  'NORMAL',
  // 3 points of the correct second position
  'SECOND_POSITION',
  // 3 points of the correct forth position
  'FOURTH_POSITION',
  // 3 points of the correct center position
  'CENTER_POSITION',
  // -1 point if first position is wrong
  'CURSED_FIRST_POSITION',
  // -1 point if last position is wrong
  'CURSED_LAST_POSITION',
];
