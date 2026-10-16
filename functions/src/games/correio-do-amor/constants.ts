/**
 * Phase identifiers used by the `correio-do-amor` engine.
 */
export const CORREIO_DO_AMOR_PHASES = {
  SETUP: 'SETUP',
  CARD_PLAY: 'CARD_PLAY',
  CARD_EFFECTS: 'CARD_EFFECTS',
  CARD_RESOLUTION: 'CARD_RESOLUTION',
  ROUND_RANKING: 'ROUND_RANKING',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `correio-do-amor` engine.
 */
export const CORREIO_DO_AMOR_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
  SUBMIT_SELECTIONS: 'SUBMIT_SELECTIONS',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * Deck sizes and set-aside card counts indexed by player count.
 */
export const DECK_INFO_BY_PLAYER_COUNT = {
  2: {
    totalCards: 16,
    setAsideCards: 4,
  },
  3: {
    totalCards: 16,
    setAsideCards: 1,
  },
  4: {
    totalCards: 17,
    setAsideCards: 1,
  },
  5: {
    totalCards: 20,
    setAsideCards: 1,
  },
  6: {
    totalCards: 21,
    setAsideCards: 1,
  },
} as const;

/**
 * Point values and thresholds used when resolving game results.
 */
export const POINTS = {
  WIN_ROUND: 3,
  BONUS: 1,
  PENALTY: -1,
  GOAL: 7,
} as const;

/**
 * Status identifiers for active, eliminated, and immune players.
 */
export const PLAYER_STATUS = {
  ACTIVE: 'ACTIVE',
  ELIMINATED: 'ELIMINATED',
  IMMUNE: 'IMMUNE',
} as const;

/**
 * Card-effect keywords used to dispatch play resolution.
 */
export const KEYWORDS = {
  COUNTER_ATTACK: 'COUNTER_ATTACK',
  SURVIVE_SOLO: 'SURVIVE_SOLO',
  AUTO_WIN_COMPARE: 'AUTO_WIN_COMPARE',
  GAIN_POINT_ON_ELIMINATION: 'GAIN_POINT_ON_ELIMINATION',
  GUESS_RANK: 'GUESS_RANK',
  GUESS_NAME: 'GUESS_NAME',
  PEEK: 'PEEK',
  PEEK_ASIDE: 'PEEK_ASIDE',
  COMPARE_LOWER: 'COMPARE_LOWER',
  COMPARE_HIGHER: 'COMPARE_HIGHER',
  IMMUNITY_BONUS: 'IMMUNITY_BONUS',
  IMMUNITY: 'IMMUNITY',
  DISCARD_REDRAW: 'DISCARD_REDRAW',
  TRADE_HANDS: 'TRADE_HANDS',
  FORCE_TRADE: 'FORCE_TRADE',
  TRADE_ASIDE: 'TRADE_ASIDE',
  EXCHANGE_TOP: 'EXCHANGE_TOP',
  PASS_LEFT: 'PASS_LEFT',
  SHUFFLE: 'SHUFFLE',
  FORCE_PLAY: 'FORCE_PLAY',
  WIN_PENALTY: 'WIN_PENALTY',
  AUTO_ELIMINATE: 'AUTO_ELIMINATE',
  CONDITIONAL_WIN: 'CONDITIONAL_WIN',
} as const;

/**
 * Keywords recording the result of a resolved card effect.
 */
export const RESOLUTION_KEYWORD = {
  COUNTER_ATTACK: 'COUNTER_ATTACK',
  AUTO_WIN_COMPARE: 'AUTO_WIN_COMPARE',
  TARGET_ELIMINATED: 'TARGET_ELIMINATED',
  ACTOR_ELIMINATED: 'ACTOR_ELIMINATED',
  INCORRECT: 'INCORRECT',
  TIE: 'TIE',
  AUTO_ELIMINATE: 'AUTO_ELIMINATE',
  NO_CARD_TO_DRAW: 'NO_CARD_TO_DRAW',
  NO_TARGET_AVAILABLE: 'NO_TARGET_AVAILABLE',
  DISCARDED_AND_REDRAWN: 'DISCARDED_AND_REDRAWN',
  TRADE_HANDS: 'TRADE_HANDS',
  TRADE_ASIDE: 'TRADE_ASIDE',
  EXCHANGE_TOP: 'EXCHANGE_TOP',
  PASS_LEFT: 'PASS_LEFT',
  SHUFFLE: 'SHUFFLE',
  IMMUNITY: 'IMMUNITY',
  GAIN_POINT_ON_ELIMINATION: 'GAIN_POINT_ON_ELIMINATION',
  PEEK: 'PEEK',
  PEEK_ASIDE: 'PEEK_ASIDE',
  PLAYED: 'PLAYED',
  ERROR: 'ERROR',
} as const;

/**
 * Durations used to expire ongoing effects by turn or round.
 */
export const ONGOING_EFFECT_TYPE = {
  TURN: 'TURN',
  ROUND: 'ROUND',
} as const;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  SETUP: 'SETUP',
  CONTINUE: 'CONTINUE',
  END_ROUND: 'END_ROUND',
  END_GAME: 'END_GAME',
} as const;
