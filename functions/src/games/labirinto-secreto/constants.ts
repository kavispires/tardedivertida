/**
 * Phase identifiers used by the `labirinto-secreto` engine.
 */
export const LABIRINTO_SECRETO_PHASES = {
  SETUP: 'SETUP',
  MAP_BUILDING: 'MAP_BUILDING',
  PATH_FOLLOWING: 'PATH_FOLLOWING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `labirinto-secreto` engine.
 */
export const LABIRINTO_SECRETO_ACTIONS = {
  SUBMIT_MAP: 'SUBMIT_MAP',
  SUBMIT_PATH: 'SUBMIT_PATH',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 5;

/**
 * The default number of forest cells included in a player path.
 */
export const PATH_DISTANCE = 11;
/**
 * The number of columns in the forest grid.
 */
export const FOREST_WIDTH = 7;
/**
 * The number of rows in the forest grid.
 */
export const FOREST_HEIGHT = 7;

/**
 * Tree appearances indexed by flattened forest-cell identifier.
 */
export const TREE_TYPE_BY_ID = {
  0: 0,
  1: 0,
  2: 1,
  3: 1,
  4: 1,
  5: 0,
  6: 0,
  7: 0,
  8: 1,
  9: 1,
  10: 1,
  11: 2,
  12: 2,
  13: 0,
  14: 3,
  15: 1,
  16: 1,
  17: 2,
  18: 2,
  19: 3,
  20: 3,
  21: 1,
  22: 1,
  23: 2,
  24: 2,
  25: 3,
  26: 3,
  27: 4,
  28: 1,
  29: 2,
  30: 2,
  31: 3,
  32: 3,
  33: 4,
  34: 4,
  35: 0,
  36: 2,
  37: 3,
  38: 3,
  39: 4,
  40: 4,
  41: 0,
  42: 0,
  43: 0,
  44: 1,
  45: 2,
  46: 2,
  47: 0,
  48: 0,
};

/**
 * Reserved tree-pattern definitions available to forest generation.
 */
export const TREE_PATTERNS = {
  A: {},
  B: {},
  C: {},
};

/**
 * Compass-direction identifiers for neighboring forest cells.
 */
export const DIRECTIONS = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  UP_LEFT: 'UP_LEFT',
  UP_RIGHT: 'UP_RIGHT',
  DOWN_LEFT: 'DOWN_LEFT',
  DOWN_RIGHT: 'DOWN_RIGHT',
};

/**
 * The number of cards allocated to each player's deck.
 */
export const CARDS_PER_PLAYER = 38;
/**
 * The number of cards offered for the initial mulligan.
 */
export const MULLIGAN_HAND = 5;
/**
 * The number of cards dealt to each player at setup.
 */
export const STARTING_CARDS = 5;
/**
 * The number of cards dealt to each player in a round.
 */
export const CARDS_PER_ROUND = 4;

/**
 * Preset forest paths indexed by their starting tree identifier.
 */
export const DEFAULT_PATHS: Record<string, [number, number][]> = {
  // --- TOP SIDE ---
  '2': [
    [2, 0],
    [2, 1],
    [1, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [3, 3],
    [2, 3],
    [2, 4],
    [1, 4],
    [1, 5],
  ],
  '3': [
    [3, 0],
    [3, 1],
    [4, 1],
    [4, 2],
    [3, 2],
    [2, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
    [4, 5],
  ],
  '4': [
    [4, 0],
    [4, 1],
    [5, 1],
    [5, 2],
    [4, 2],
    [3, 2],
    [3, 3],
    [4, 3],
    [4, 4],
    [5, 4],
    [5, 5],
  ],

  // --- LEFT SIDE ---
  '14': [
    [0, 2],
    [1, 2],
    [1, 1],
    [2, 1],
    [2, 2],
    [2, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 5],
  ],
  '21': [
    [0, 3],
    [1, 3],
    [1, 2],
    [2, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [2, 4],
    [2, 5],
    [1, 5],
    [1, 4],
  ],
  '28': [
    [0, 4],
    [1, 4],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 4],
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 5],
    [2, 5],
  ],

  // --- RIGHT SIDE ---
  '20': [
    [6, 2],
    [5, 2],
    [5, 1],
    [4, 1],
    [4, 2],
    [4, 3],
    [5, 3],
    [5, 4],
    [4, 4],
    [3, 4],
    [3, 5],
  ],
  '27': [
    [6, 3],
    [5, 3],
    [5, 2],
    [4, 2],
    [4, 3],
    [3, 3],
    [3, 4],
    [4, 4],
    [4, 5],
    [5, 5],
    [5, 4],
  ],
  '34': [
    [6, 4],
    [5, 4],
    [5, 3],
    [4, 3],
    [4, 4],
    [3, 4],
    [3, 3],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ],

  // --- BOTTOM SIDE ---
  '44': [
    [2, 6],
    [2, 5],
    [1, 5],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 3],
    [2, 3],
    [2, 2],
    [1, 2],
    [1, 1],
  ],
  '45': [
    [3, 6],
    [3, 5],
    [2, 5],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 3],
    [3, 3],
    [3, 2],
    [2, 2],
    [2, 1],
  ],
  '46': [
    [4, 6],
    [4, 5],
    [5, 5],
    [5, 4],
    [4, 4],
    [3, 4],
    [3, 3],
    [4, 3],
    [4, 2],
    [5, 2],
    [5, 1],
  ],
};

// Circular 7x7 forest plan
/**
 * Forest-cell identifiers available as player starting points.
 */
export const STARTING_TREES = [2, 3, 4, 14, 21, 28, 20, 27, 34, 44, 45, 46];

/**
 * Forest-cell identifiers excluded from generated paths.
 */
export const FORBIDDEN_TREES = [0, 1, 5, 6, 7, 13, 35, 41, 42, 43, 47, 48];

/**
 * Grid coordinates excluded from generated forest paths.
 */
export const FORBIDDEN_CELLS = [
  [0, 0],
  [1, 0],
  [0, 1],
  [6, 0],
  [5, 0],
  [6, 1],
  [0, 6],
  [0, 5],
  [1, 6],
  [6, 6],
  [5, 6],
  [6, 5],
];
