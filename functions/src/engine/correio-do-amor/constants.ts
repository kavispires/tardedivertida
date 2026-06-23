export const CORREIO_DO_AMOR_PHASES = {
  SETUP: 'SETUP',
  CARD_PLAY: 'CARD_PLAY',
  CARD_EFFECTS: 'CARD_EFFECTS',
  CARD_RESOLUTION: 'CARD_RESOLUTION',
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
    totalCards: 20,
    setAsideCards: 1,
  },
} as const;

export const POINTS_PER_ROUND = 3;

export const POINTS_GOAL = 7;

export const PLAYER_STATUS = {
  ACTIVE: 'ACTIVE',
  ELIMINATED: 'ELIMINATED',
} as const;

export const OUTCOME = {
  SETUP: 'SETUP',
  CONTINUE: 'CONTINUE',
  END_ROUND: 'END_ROUND',
} as const;
