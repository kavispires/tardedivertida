/**
 * Phase identifiers used by the `vamos-ao-cinema` engine.
 */
export const VAMOS_AO_CINEMA_PHASES = {
  SETUP: 'SETUP',
  MOVIE_SELECTION: 'MOVIE_SELECTION',
  MOVIE_ELIMINATION: 'MOVIE_ELIMINATION',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `vamos-ao-cinema` engine.
 */
export const VAMOS_AO_CINEMA_ACTIONS = {
  SELECT_MOVIE: 'SELECT_MOVIE',
  ELIMINATE_MOVIE: 'ELIMINATE_MOVIE',
  VOTE_FOR_POSTER: 'VOTE_FOR_POSTER',
} as const;

/**
 * Achievement identifiers awarded by the `vamos-ao-cinema` engine.
 */
export const VAMOS_AO_CINEMA_ACHIEVEMENTS = {
  MOST_GROUP_SELECTIONS: 'MOST_GROUP_SELECTIONS',
  MOST_SOLO_SELECTIONS: 'MOST_SOLO_SELECTIONS',
  MOST_COUPLE_SELECTIONS: 'MOST_COUPLE_SELECTIONS',
  MOST_BAD_ELIMINATIONS: 'MOST_BAD_ELIMINATIONS',
  MOST_ELIMINATED_MOVIE: 'MOST_ELIMINATED_MOVIE',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 9,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;
/**
 * The number of movie resources selected for each round.
 */
export const MOVIES_PER_ROUND = 12;
/**
 * The number of review cards offered for clue creation.
 */
export const TOTAL_REVIEW_CARDS = 6;
/**
 * The number of movie options offered for selection.
 */
export const TOTAL_MOVIE_OPTIONS = 10;
/**
 * The maximum number of mistakes allowed during movie selection.
 */
export const MAX_MISTAKES = 2;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  MISTAKE: 'MISTAKE',
  DONE: 'DONE',
};

/**
 * The number of movie posters available in the sprite library.
 */
export const MOVIE_POSTERS_COUNT = 70;
