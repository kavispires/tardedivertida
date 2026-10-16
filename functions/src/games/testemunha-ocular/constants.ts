/**
 * Phase identifiers used by the `testemunha-ocular` engine.
 */
export const TESTEMUNHA_OCULAR_PHASES = {
  SETUP: 'SETUP',
  WITNESS_SELECTION: 'WITNESS_SELECTION',
  QUESTION_SELECTION: 'QUESTION_SELECTION',
  QUESTIONING: 'QUESTIONING',
  TRIAL: 'TRIAL',
  FINAL_TRIAL: 'FINAL_TRIAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `testemunha-ocular` engine.
 */
export const TESTEMUNHA_OCULAR_ACTIONS = {
  SELECT_WITNESS: 'SELECT_WITNESS',
  SELECT_QUESTION: 'SELECT_QUESTION',
  GIVE_TESTIMONY: 'GIVE_TESTIMONY',
  ELIMINATE_SUSPECT: 'ELIMINATE_SUSPECT',
  FINAL_ELIMINATION: 'FINAL_ELIMINATION',
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
export const MAX_ROUNDS = 10;

/**
 * The standard number of suspects included in the investigation.
 */
export const SUSPECT_COUNT = 12;

/**
 * Additional suspects included by the larger-pool option.
 */
export const HARD_MODE_EXTRA_SUSPECT_COUNT = 6;

/**
 * The number of testimony questions selected for the investigation.
 */
export const QUESTION_COUNT = 20;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  WIN: 'WIN',
  LOSE: 'LOSE',
  FINAL_SHOWDOWN: 'FINAL_SHOWDOWN',
} as const;
