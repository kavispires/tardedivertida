/**
 * Phase identifiers used by the `fofoca-quente` engine.
 */
export const FOFOCA_QUENTE_PHASES = {
  SETUP: 'SETUP',
  ROLES_SELECTION: 'ROLES_SELECTION',
  BOARD_SETUP: 'BOARD_SETUP',
  INTIMIDATION: 'INTIMIDATION',
  RUMOR: 'RUMOR',
  RESPONSE: 'RESPONSE',
  INVESTIGATION: 'INVESTIGATION',
  SCHOOL: 'SCHOOL',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `fofoca-quente` engine.
 */
export const FOFOCA_QUENTE_ACTIONS = {
  SUBMIT_PLAYERS_ROLES: 'SUBMIT_PLAYERS_ROLES',
  SUBMIT_SOCIAL_GROUP: 'SUBMIT_SOCIAL_GROUP',
  SUBMIT_INTIMIDATION: 'SUBMIT_INTIMIDATION',
  SUBMIT_RUMOR: 'SUBMIT_RUMOR',
  SUBMIT_SKIP_RUMOR: 'SUBMIT_SKIP_RUMOR',
  SUBMIT_RESPONSE: 'SUBMIT_RESPONSE',
  UPDATE_DETECTIVE_POSITION: 'UPDATE_DETECTIVE_POSITION',
  UPDATE_STUDENT_POSITION: 'MOVE_STUDENTS',
  // TODO: do I need more specific?
  SUBMIT_INVESTIGATION: 'SUBMIT_INVESTIGATION',
} as const;

/**
 * Achievement identifiers awarded by the `fofoca-quente` engine.
 */
export const FOFOCA_QUENTE_ACHIEVEMENTS = {
  PLAYED_AS_GOSSIPER: 'PLAYED_AS_GOSSIPER',
  PLAYED_AS_DETECTIVE: 'PLAYED_AS_DETECTIVE',
  WON_AS_GOSSIPER: 'WON_AS_GOSSIPER',
  WON_AS_DETECTIVE: 'WON_AS_DETECTIVE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 2,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 6;

/**
 * The number of students included in the school setup.
 */
export const TOTAL_STUDENTS = 20;

/**
 * The number of rumor resources selected for the game.
 */
export const TOTAL_RUMORS = 10;

/**
 * The number of gossiper motivations selected for the game.
 */
export const TOTAL_MOTIVATIONS = 6;

/**
 * School-board location indices used to place students at setup.
 */
export const STARTING_STUDENT_POSITIONS = [
  0, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 15, 15,
];
