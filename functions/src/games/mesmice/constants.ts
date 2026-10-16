/**
 * Phase identifiers used by the `mesmice` engine.
 */
export const MESMICE_PHASES = {
  SETUP: 'SETUP',
  CLUE_WRITING: 'CLUE_WRITING',
  OBJECT_FEATURE_ELIMINATION: 'OBJECT_FEATURE_ELIMINATION',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `mesmice` engine.
 */
export const MESMICE_ACTIONS = {
  SUBMIT_OBJECT: 'SUBMIT_OBJECT',
  SUBMIT_OBJECT_FEATURE: 'SUBMIT_OBJECT_FEATURE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 10;

/**
 * Complexity identifiers controlling the available object-feature levels.
 */
export const GAME_COMPLEXITY = {
  NORMAL: 'NORMAL',
  MORE: 'MORE',
};

/**
 * Difficulty identifiers controlling feature counts and scoring.
 */
export const GAME_DIFFICULTY = {
  EASY: 'EASY',
  HARD: 'HARD',
};

/**
 * Feature counts by level for each complexity and difficulty combination.
 */
export const FEATURES_COUNTS = {
  [GAME_COMPLEXITY.NORMAL]: {
    [GAME_DIFFICULTY.EASY]: {
      1: 4,
      2: 2,
      3: 0,
      4: 0,
    },
    [GAME_DIFFICULTY.HARD]: {
      1: 5,
      2: 2,
      3: 1,
      4: 0,
    },
  },
  [GAME_COMPLEXITY.MORE]: {
    [GAME_DIFFICULTY.EASY]: {
      1: 2,
      2: 1,
      3: 2,
      4: 1,
    },
    [GAME_DIFFICULTY.HARD]: {
      1: 3,
      2: 2,
      3: 2,
      4: 1,
    },
  },
};

/**
 * The number of item choices assigned to each player.
 */
export const ITEMS_PER_PLAYER = 3;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  NEW: 'NEW',
  CONTINUE: 'CONTINUE',
  WIN: 'WIN',
  LOSE: 'LOSE',
};

/**
 * Point schedules indexed by difficulty.
 */
export const SCORING = {
  [GAME_DIFFICULTY.EASY]: [0, 1, 1, 2, 3],
  [GAME_DIFFICULTY.HARD]: [0, 0, 1, 1, 1, 2, 2],
};
