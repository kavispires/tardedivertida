/**
 * Phase identifiers used by the `crimes-hediondos` engine.
 */
export const CRIMES_HEDIONDOS_PHASES = {
  SETUP: 'SETUP',
  CRIME_SELECTION: 'CRIME_SELECTION',
  SCENE_MARKING: 'SCENE_MARKING',
  GUESSING: 'GUESSING',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `crimes-hediondos` engine.
 */
export const CRIMES_HEDIONDOS_ACTIONS = {
  SUBMIT_CRIME: 'SUBMIT_CRIME',
  SUBMIT_MARK: 'SUBMIT_MARK',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

/**
 * Achievement identifiers awarded by the `crimes-hediondos` engine.
 */
export const CRIMES_HEDIONDOS_ACHIEVEMENTS = {
  MOST_WRONG_GROUPS: 'MOST_WRONG_GROUPS',
  MOST_WRONG_GUESSES: 'MOST_WRONG_GUESSES',
  MOST_ONE_GUESSES: 'MOST_ONE_GUESSES',
  MOST_TWO_GUESSES: 'MOST_TWO_GUESSES',
  MOST_THREE_GUESSES: 'MOST_THREE_GUESSES',
  MOST_CORRECT_GUESSES: 'MOST_CORRECT_GUESSES',
  EARLIEST_CORRECT_GUESS: 'EARLIEST_CORRECT_GUESS',
  LATEST_CORRECT_GUESS: 'LATEST_CORRECT_GUESS',
  MOST_SELECTED_WEAPONS: 'MOST_SELECTED_WEAPONS',
  FEWEST_SELECTED_WEAPONS: 'FEWEST_SELECTED_WEAPONS',
  MOST_SELECTED_EVIDENCE: 'MOST_SELECTED_EVIDENCE',
  FEWEST_SELECTED_EVIDENCE: 'FEWEST_SELECTED_EVIDENCE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 9;
/**
 * The number of scene tiles selected for a crime.
 */
export const SCENE_TILES_COUNT = 6;

/**
 * The number of item cards selected for the crime table.
 */
export const CARDS_PER_GAME = 16;

/**
 * The number of item groups displayed on the crime table.
 */
export const ITEMS_GROUP_COUNT = 4;
/**
 * The number of cards placed in each crime-table group.
 */
export const ITEMS_PER_GROUP = 4;

/**
 * Feedback identifiers for correct, partially correct, and incorrect crime guesses.
 */
export const GUESS_STATUS = {
  LOCKED: 'LOCKED',
  CORRECT: 'CORRECT',
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
  WRONG_GROUP: 'WRONG_GROUP',
  WRONG: 'WRONG',
};
