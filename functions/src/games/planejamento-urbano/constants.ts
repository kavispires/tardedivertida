/**
 * Phase identifiers used by the `planejamento-urbano` engine.
 */
export const PLANEJAMENTO_URBANO_PHASES = {
  SETUP: 'SETUP',
  PLANNING: 'PLANNING',
  PLACING: 'PLACING',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `planejamento-urbano` engine.
 */
export const PLANEJAMENTO_URBANO_ACTIONS = {
  SUBMIT_PLANNING: 'SUBMIT_PLANNING',
  SUBMIT_PLACEMENTS: 'SUBMIT_PLACEMENTS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 6;
/**
 * The number of city locations proposed each round.
 */
export const LOCATIONS_PER_ROUND = 3;
/**
 * The number of rows and columns in the square city grid.
 */
export const CITY_BOUNDS_SIZE = 7;

/**
 * Points awarded to the architect for a matching location guess.
 */
export const ARCHITECT_MATCH_POINTS = 3;
/**
 * Passive points awarded to the architect when resolving a location.
 */
export const ARCHITECT_PASSIVE_POINTS = 1;
/**
 * Points awarded to a player for matching the intended location.
 */
export const PLAYER_MATCH_POINTS = 1;

/**
 * Identifiers used to distinguish construction cones.
 */
export const CONES = ['A', 'B', 'C', 'D'] as const;
