/**
 * Phase identifiers used by the `esquiadores` engine.
 */
export const ESQUIADORES_PHASES = {
  SETUP: 'SETUP',
  BETS: 'BETS',
  STARTING_RESULTS: 'STARTING_RESULTS',
  BOOSTS: 'BOOSTS',
  PRELIMINARY_RESULTS: 'PRELIMINARY_RESULTS',
  LAST_CHANGE: 'LAST_CHANGE',
  FINAL_RESULTS: 'FINAL_RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `esquiadores` engine.
 */
export const ESQUIADORES_ACTIONS = {
  SUBMIT_CHOICES: 'SUBMIT_CHOICES',
  SUBMIT_BETS: 'SUBMIT_BETS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * The player-count threshold used when deciding whether to double the round order.
 */
export const DOUBLE_ROUNDS_THRESHOLD = 4;

/**
 * The number of dilemma cards selected for each mountain round.
 */
export const DILEMMAS_PER_ROUND = 6;

/**
 * Betting-chip allocations for the initial, boost, and final betting stages.
 */
export const BETTING_CHIPS = {
  INITIAL: 8,
  BOOST: 4,
  FINAL: 3,
};

/**
 * Betting-chip allocations for the skier during each betting stage.
 */
export const SKIERS_BETTING_CHIPS = {
  INITIAL: 0,
  BOOST: 3,
  FINAL: 7,
};

/**
 * The bonus available to help trailing players catch up.
 */
export const CATCH_UP_BONUS = 5;

/**
 * Identifiers of the regular betting stages.
 */
export const BET_TYPES = {
  INITIAL: 'initial',
  BOOST: 'boost',
  FINAL: 'final',
};

/**
 * Identifiers of the skier-specific betting selections.
 */
export const SKIER_BET_TYPES = {
  SKIERS_BETS: 'skiersBets',
  SKIERS_BOOST: 'skiersBoost',
};

/**
 * Identifiers of the mountain sections revealed as the skier progresses.
 */
export const MOUNTAIN_SECTION = {
  SUMMIT: 'SUBMIT', // nothing is displayed
  LEVEL_1: 'LEVEL_1', // after first decision
  LEVEL_2: 'LEVEL_2', // after second decision
  LODGE: 'LODGE', // after final decision
} as const;
