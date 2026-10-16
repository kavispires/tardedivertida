/**
 * Phase identifiers used by the `ue-so-isso` engine.
 */
export const UE_SO_ISSO_PHASES = {
  SETUP: 'SETUP',
  WORD_SELECTION: 'WORD_SELECTION',
  SUGGEST: 'SUGGEST',
  COMPARE: 'COMPARE',
  GUESS: 'GUESS',
  VERIFY_GUESS: 'VERIFY_GUESS',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `ue-so-isso` engine.
 */
export const UE_SO_ISSO_ACTIONS = {
  SUBMIT_VOTES: 'SUBMIT_VOTES',
  SUBMIT_SUGGESTIONS: 'SUBMIT_SUGGESTIONS',
  SUBMIT_OUTCOME: 'SUBMIT_OUTCOME',
  VALIDATE_SUGGESTION: 'VALIDATE_SUGGESTION',
  SEND_GUESS: 'SEND_GUESS',
  SUBMIT_VALIDATION: 'SUBMIT_VALIDATION',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The number of candidate words offered on a selection card.
 */
export const WORDS_PER_CARD = 5;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  WIN: 'WIN',
  LOSE: 'LOSE',
  WRONG: 'WRONG',
  CORRECT: 'CORRECT',
  INCONCLUSIVE: 'INCONCLUSIVE',
  PASS: 'PASS',
};

/**
 * The number of incorrect guesses allowed before defeat.
 */
export const ALLOWED_MISTAKES = 3;
/**
 * The target score required to complete the game.
 */
export const GOAL = 7;
/**
 * Points awarded for a correct final guess.
 */
export const CORRECT_GUESS_SCORE = 2;
/**
 * The score adjustment applied to an incorrect final guess.
 */
export const INCORRECT_GUESS_SCORE = -1;
