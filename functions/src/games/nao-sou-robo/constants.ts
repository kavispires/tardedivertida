/**
 * Phase identifiers used by the `nao-sou-robo` engine.
 */
export const NAO_SOU_ROBO_PHASES = {
  SETUP: 'SETUP',
  CARD_SELECTION: 'CARD_SELECTION',
  ARE_YOU_A_ROBOT: 'ARE_YOU_A_ROBOT',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `nao-sou-robo` engine.
 */
export const NAO_SOU_ROBO_ACTIONS = {
  SUBMIT_CARDS: 'SUBMIT_CARDS',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
} as const;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  TOO_SUSPICIOUS: 'TOO_SUSPICIOUS',
  ROBOT_WINS: 'ROBOT_WINS',
  HUMANS_WIN: 'HUMANS_WIN',
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * The number of cards dealt to each player at setup.
 */
export const STARTING_HAND = 8;

/**
 * Round variants used to select the rules or resource category.
 */
export const ROUND_TYPES = ['colors', 'emotions', 'glyphs', 'words', 'emojis', 'warehouse-goods', 'words'];

/**
 * The number of goods sprites available in the resource library.
 */
export const GOODS_LIBRARY_COUNT = 256;

/**
 * The minimum number of options displayed in a captcha round.
 */
export const MIN_ROUND_CARDS = 9;

/**
 * The number of selections required from each player, indexed by player count.
 */
export const CARD_SELECTION_PER_PLAYER_COUNT = {
  2: 3,
  3: 2,
  4: 4,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
} as const;

/**
 * Robot victory goals indexed by the number of players.
 */
export const ROBOT_GOAL_BY_PLAYER_COUNT = {
  2: 20,
  3: 20,
  4: 20,
  5: 15,
  6: 15,
  7: 8,
  8: 5,
} as const;

/**
 * The suspicion threshold used to resolve suspicious captcha choices.
 */
export const SUSPICION_THRESHOLD = 3;

/**
 * The threshold used to evaluate whether the robot has been beaten.
 */
export const BEAT_THRESHOLD = 3;
