/**
 * ID use for NPC players
 */
export const NPC = 'NPC';

/**
 * Document name for tracking used game IDs
 */
export const USED_GAME_IDS = 'usedGameIds';

/**
 * Common phases used in all/most games, such as SETUP and GAME_OVER
 */
export const GAME_PROCESS_PHASES = {
  SETUP: 'SETUP',
  GAME_OVER: 'GAME_OVER',
  WAIT: 'WAIT',
} as const;

/**
 * Threshold for the number of rounds in a game to trigger double rounds
 */
export const DOUBLE_ROUNDS_THRESHOLD = 6;

/**
 * Separator used in game data strings
 * @example "item1;;item2;;item3"
 */
export const SEPARATOR = ';;';

/**
 * String of uppercase letters used for generating game codes
 */
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
