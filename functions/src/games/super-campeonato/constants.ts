/**
 * Phase identifiers used by the `super-campeonato` engine.
 */
export const SUPER_CAMPEONATO_PHASES = {
  SETUP: 'SETUP',
  CHALLENGE_SELECTION: 'CHALLENGE_SELECTION',
  CONTENDER_SELECTION: 'CONTENDER_SELECTION',
  BETS: 'BETS',
  BATTLE: 'BATTLE',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `super-campeonato` engine.
 */
export const SUPER_CAMPEONATO_ACTIONS = {
  SUBMIT_CHALLENGE: 'SUBMIT_CHALLENGE',
  SUBMIT_CONTENDERS: 'SUBMIT_CONTENDERS',
  SUBMIT_BETS: 'SUBMIT_BETS',
  SUBMIT_VOTES: 'SUBMIT_VOTES',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 30,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;

/**
 * The number of contenders entering each tournament round.
 */
export const CONTENDERS_PER_ROUND = 8;

/**
 * The number of contender options allocated to each player.
 */
export const CONTENDERS_PER_PLAYER = 9;

/**
 * The number of challenge prompts selected for a tournament round.
 */
export const CHALLENGES_PER_ROUND = 2;

/**
 * The total number of challenge prompts needed for the game.
 */
export const CHALLENGES_PER_GAME = CHALLENGES_PER_ROUND * TOTAL_ROUNDS;

/**
 * Tournament tiers in the order battles are resolved.
 */
export const CHAMPIONSHIP_ORDER = ['quarter', 'semi', 'final'];
