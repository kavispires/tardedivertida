/**
 * Phase identifiers used by the `teoria-de-conjuntos` engine.
 */
export const TEORIA_DE_CONJUNTOS_PHASES = {
  SETUP: 'SETUP',
  JUDGE_SELECTION: 'JUDGE_SELECTION',
  ITEM_PLACEMENT: 'ITEM_PLACEMENT',
  EVALUATION: 'EVALUATION',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `teoria-de-conjuntos` engine.
 */
export const TEORIA_DE_CONJUNTOS_ACTIONS = {
  SUBMIT_JUDGE: 'SUBMIT_JUDGE',
  SUBMIT_ITEM_PLACEMENT: 'SUBMIT_ITEM_PLACEMENT',
  SUBMIT_EVALUATION: 'SUBMIT_EVALUATION',
  SUBMIT_EVALUATION_FIX: 'SUBMIT_EVALUATION_FIX',
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
export const MAX_ROUNDS = 30;

/**
 * The number of rounds allocated per player.
 */
export const ROUNDS_PER_PLAYER = 5;

/**
 * Initial hand sizes indexed by the number of players.
 */
export const STARTING_ITEMS_PER_PLAYER_COUNT = {
  2: 5,
  3: 5,
  4: 5,
  5: 5,
  6: 4,
  7: 4,
  8: 4,
  9: 3,
  10: 3,
};

/**
 * The number of item cards allocated to the judge.
 */
export const JUDGE_HAND_QUANTITY = 15;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  WRONG: 'WRONG',
  PENDING: 'PENDING',
  WIN: 'WIN',
};
