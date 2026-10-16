/**
 * Phase identifiers used by the `vendaval-de-palpite` engine.
 */
export const VENDAVAL_DE_PALPITE_PHASES = {
  SETUP: 'SETUP',
  BOSS_SELECTION: 'BOSS_SELECTION',
  SECRET_WORD_SELECTION: 'SECRET_WORD_SELECTION',
  PLAYERS_CLUES: 'PLAYERS_CLUES',
  CLUE_EVALUATIONS: 'CLUE_EVALUATIONS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `vendaval-de-palpite` engine.
 */
export const VENDAVAL_DE_PALPITE_ACTIONS = {
  SUBMIT_BOSS: 'SUBMIT_BOSS',
  SUBMIT_SECRET_WORD: 'SUBMIT_SECRET_WORD',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_EVALUATION: 'SUBMIT_EVALUATION',
  SUBMIT_OUTCOME: 'SUBMIT_OUTCOME',
  SUBMIT_HELP: 'SUBMIT_HELP',
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
export const MAX_ROUNDS = 7;

/**
 * The number of candidate secret words loaded for the game.
 */
export const TOTAL_WORDS_NEEDED = 5;

// The count includes the Boss
/**
 * The number of clues required from each player, indexed by player count.
 */
export const CLUES_PER_PLAYER = {
  2: 4,
  3: 2,
  4: 2,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
};

/**
 * The number of final-answer attempts available to the team.
 */
export const FINAL_ANSWER_COUNT = 3;
