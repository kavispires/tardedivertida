/**
 * Phase identifiers used by the `escape-room` engine.
 */
export const ESCAPE_ROOM_PHASES = {
  RULES: 'RULES',
  SETUP: 'SETUP',
  MISSION: 'MISSION',
  MISSION_EVALUATION: 'MISSION_EVALUATION',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `escape-room` engine.
 */
export const ESCAPE_ROOM_ACTIONS = {
  SUBMIT_CARD_PLAY: 'SUBMIT_CARD_PLAY',
} as const;

/**
 * Achievement identifiers awarded by the `escape-room` engine.
 */
export const ESCAPE_ROOM_ACHIEVEMENTS = {
  LEAD_MISSION: 'LEAD_MISSION', // Had a mission card
  FIRST_CARD_PLAYED: 'FIRST_CARD_PLAYED', // Played the first card on a mission
  COMPLETED_MISSION: 'COMPLETED_MISSION', // PLayed the complete mission card
  MOST_WRONG_CARDS: 'MOST_WRONG_CARDS', // Played the most wrong cards in a mission
  HELP_CARD: 'HELP_CARD', // Played a help card
  SUCCESSFUL_ESCAPE: 'SUCCESSFUL_ESCAPE', // All players
  FAILED_ESCAPE: 'FAILED_ESCAPE', // All players
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3, // TODO: change to 4
  MAX: 7,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 7;

/**
 * The initial number of lives available for completing the missions.
 */
export const HEARTS = 3;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  WIN: 'WIN',
  LOSE: 'LOSE',
  CONTINUE: 'CONTINUE',
  NEW_MISSION: 'NEW_MISSION',
  HELP: 'HELP',
} as const;

/**
 * Mission counts indexed by the selected game-duration option.
 */
export const MISSIONS_COUNT = {
  long: 7,
  default: 5,
  short: 3,
};
