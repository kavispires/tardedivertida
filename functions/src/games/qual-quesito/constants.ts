/**
 * Phase identifiers used by the `qual-quesito` engine.
 */
export const QUAL_QUESITO_PHASES = {
  SETUP: 'SETUP',
  CATEGORY_CREATION: 'CATEGORY_CREATION',
  SKIP_ANNOUNCEMENT: 'SKIP_ANNOUNCEMENT',
  CARD_PLAY: 'CARD_PLAY',
  VERIFICATION: 'VERIFICATION',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `qual-quesito` engine.
 */
export const QUAL_QUESITO_ACTIONS = {
  SUBMIT_CATEGORY: 'SUBMIT_CATEGORY',
  SKIP_TURN: 'SKIP_TURN',
  SUBMIT_CARDS: 'SUBMIT_CARDS',
  SUBMIT_EVALUATIONS: 'SUBMIT_EVALUATIONS',
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
export const TOTAL_ROUNDS = 15;

/**
 * The number of cards allocated to each player's deck.
 */
export const CARDS_PER_PLAYER = 9;
/**
 * The number of item cards allocated per player when building the deck.
 */
export const DECK_PER_PLAYER = 10;

/**
 * Base points awarded to the category creator.
 */
export const CREATOR_SCORE_POINTS = 2;
/**
 * Points awarded to other players for accepted category submissions.
 */
export const OTHERS_SCORE_POINTS = 3;
/**
 * Bonus points available to the category creator.
 */
export const CREATOR_SCORE_BONUS = 1;
/**
 * The score adjustment applied for consecutive rejected submissions.
 */
export const CONSECUTIVE_REJECTION_PENALTY = -1;
/**
 * Bonus points awarded when a player empties their hand.
 */
export const EMPTY_HAND_BONUS = 3;
