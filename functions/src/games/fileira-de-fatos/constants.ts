/**
 * Phase identifiers used by the `fileira-de-fatos` engine.
 */
export const FILEIRA_DE_FATOS_PHASES = {
  SETUP: 'SETUP',
  ORDERING: 'ORDERING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `fileira-de-fatos` engine.
 */
export const FILEIRA_DE_FATOS_ACTIONS = {
  SUBMIT_SCENARIO_ORDER: 'SUBMIT_SCENARIO_ORDER',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 12,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 12;

/**
 * The number of scenarios selected for each ranking round.
 */
export const SCENARIOS_PER_ROUND = 5;

/**
 * Round variants used to select the rules or resource category.
 */
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
