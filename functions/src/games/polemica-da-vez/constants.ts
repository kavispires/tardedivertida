/**
 * Phase identifiers used by the `polemica-da-vez` engine.
 */
export const POLEMICA_DA_VEZ_PHASES = {
  SETUP: 'SETUP',
  TOPIC_SELECTION: 'TOPIC_SELECTION',
  REACT: 'REACT',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `polemica-da-vez` engine.
 */
export const POLEMICA_DA_VEZ_ACTIONS = {
  SUBMIT_TOPIC: 'SUBMIT_TOPIC',
  SUBMIT_REACTION: 'SUBMIT_REACTION',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The score required to reach the game's victory goal.
 */
export const SCORE_GOAL = 10;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 15;

/**
 * The number of topic cards selected for each round.
 */
export const TOPICS_PER_ROUND = 4;

/**
 * The number of player-created topic prompts included in a round.
 */
export const CUSTOM_TOPICS_PER_ROUND = 1;
