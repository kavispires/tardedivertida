/**
 * Phase identifiers used by the `espiao-entre-nos` engine.
 */
export const ESPIAO_ENTRE_NOS_PHASES = {
  SETUP: 'SETUP',
  ASSIGNMENT: 'ASSIGNMENT',
  INVESTIGATION: 'INVESTIGATION',
  ASSESSMENT: 'ASSESSMENT',
  FINAL_ASSESSMENT: 'FINAL_ASSESSMENT',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `espiao-entre-nos` engine.
 */
export const ESPIAO_ENTRE_NOS_ACTIONS = {
  LAST_QUESTIONER: 'LAST_QUESTIONER',
  MAKE_ACCUSATION: 'MAKE_ACCUSATION',
  SUBMIT_VOTE: 'SUBMIT_VOTE',
  GUESS_LOCATION: 'GUESS_LOCATION',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 4,
  MAX: 10,
} as const;

/**
 * The number of locations available as candidates in a spy round.
 */
export const LOCATIONS_USED_IN_A_ROUND = 25;

/**
 * The reserved role identifier assigned to the spy.
 */
export const SPY = 'SPY';

/**
 * The discussion duration in milliseconds.
 */
export const GAME_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Status identifiers for the discussion timer.
 */
export const TIMER_STATUS = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED',
};

/**
 * Outcome identifiers for accusations, continued discussion, and spy guesses.
 */
export const OUTCOMES = {
  VOTE_SUCCESS: 'VOTE_SUCCESS',
  VOTE_FAIL: 'VOTE_FAIL',
  CONTINUE: 'CONTINUE',
  SPY_GUESS: 'SPY_GUESS',
  VOTE_END: 'VOTE_END',
};

/**
 * Identifiers of the final spy-game resolution paths.
 */
export const RESOLUTIONS = {
  SPY_GUESS: 'SPY_GUESS',
  SPY_FOUND: 'SPY_FOUND',
};
