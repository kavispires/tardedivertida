export const CORREIO_DO_AMOR_PHASES = {
  SETUP: 'SETUP',
  CARD_PLAY: 'CARD_PLAY',
  CARD_EFFECTS: 'CARD_EFFECTS',
  CARD_RESOLUTION: 'CARD_RESOLUTION',
  ROUND_RANKING: 'ROUND_RANKING',
  GAME_OVER: 'GAME_OVER',
} as const;

export const CORREIO_DO_AMOR_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
  SUBMIT_SELECTIONS: 'SUBMIT_SELECTIONS',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;

export const MAX_ROUNDS = 10;

export const DECK_INFO_BY_PLAYER_COUNT = {
  2: {
    totalCards: 16,
    setAsideCards: 4,
  },
  3: {
    totalCards: 16,
    setAsideCards: 2,
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

export const POINTS_PER_ROUND = 3;

export const POINTS_GOAL = 7;

export const PLAYER_STATUS = {
  ACTIVE: 'ACTIVE',
  ELIMINATED: 'ELIMINATED',
  IMMUNE: 'IMMUNE',
} as const;

export const RESOLUTION_KEYWORD = {
  COUNTER_ATTACK: 'COUNTER_ATTACK',
  AUTO_WIN_COMPARE: 'AUTO_WIN_COMPARE',
  ELIMINATED: 'ELIMINATED',
  INCORRECT: 'INCORRECT',
  SWAP_ASIDE: 'SWAP_ASIDE',
  NO_SWAP: 'NO_SWAP',
  TIE: 'TIE',
  AUTO_ELIMINATE: 'AUTO_ELIMINATE',
  NO_CARD_TO_DRAW: 'NO_CARD_TO_DRAW',
  DISCARDED_AND_REDRAWN: 'DISCARDED_AND_REDRAWN',
  TRADE_HANDS: 'TRADE_HANDS',
  EXCHANGE_TOP: 'EXCHANGE_TOP',
  PASS_LEFT: 'PASS_LEFT',
  SHUFFLE: 'SHUFFLE',
  IMMUNITY: 'IMMUNITY',
  PEEK: 'PEEK',
  PLAYED: 'PLAYED',
} as const;

export const ONGOING_EFFECT_TYPE = {
  TURN: 'TURN',
  ROUND: 'ROUND',
} as const;

export const OUTCOME = {
  SETUP: 'SETUP',
  CONTINUE: 'CONTINUE',
  END_ROUND: 'END_ROUND',
  END_GAME: 'END_GAME',
} as const;
