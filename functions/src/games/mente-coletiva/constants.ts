/**
 * Phase identifiers used by the `mente-coletiva` engine.
 */
export const MENTE_COLETIVA_PHASES = {
  SETUP: 'SETUP',
  QUESTION_SELECTION: 'QUESTION_SELECTION',
  EVERYBODY_WRITES: 'EVERYBODY_WRITES',
  COMPARE: 'COMPARE',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `mente-coletiva` engine.
 */
export const MENTE_COLETIVA_ACTIONS = {
  SUBMIT_QUESTION: 'SUBMIT_QUESTION',
  SUBMIT_CUSTOM_QUESTION: 'SUBMIT_CUSTOM_QUESTION',
  SUBMIT_ANSWERS: 'SUBMIT_ANSWERS',
  NEXT_ANSWERS: 'NEXT_ANSWERS',
  ADD_ANSWER: 'ADD_ANSWER',
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
export const MAX_ROUNDS = 15;

/**
 * The number of candidate questions offered each round.
 */
export const QUESTIONS_PER_ROUND = 3;

/**
 * The pasture level required to finish a standard game.
 */
export const PASTURE_GAME_OVER_THRESHOLD = 5;

/**
 * The pasture level required to finish a short-pasture game.
 */
export const SHORT_PASTURE_GAME_OVER_THRESHOLD = 3;

/**
 * Round variants used to select the rules or resource category.
 */
export const ROUND_TYPES = {
  0: 'ONE_IN_ONE_OUT',
  1: 'ONE_OUT',
  2: 'TWO_OUT',
  3: 'THREE_OUT',
};
