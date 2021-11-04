export const ARTE_RUIM_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
};

export const PLAYER_COUNT = {
  MIN: 3,
  MAX: 8,
};

export const MAX_ROUNDS = 10;

export const GAME_OVER_SCORE_THRESHOLD = 50;

export const DECK_ORDER_BY_LEVEL = [1, 1, 2, 3, 1, 2, 3, 1, 2, 3].reverse();

export const CARDS_PER_PLAYER_COUNT = {
  3: {
    perRound: 7,
    total: 70,
    perLevel: {
      1: 28,
      2: 21,
      3: 21,
    },
  },
  4: {
    perRound: 7,
    total: 70,
    perLevel: {
      1: 28,
      2: 21,
      3: 21,
    },
  },
  5: {
    perRound: 7,
    total: 70,
    perLevel: {
      1: 28,
      2: 21,
      3: 21,
    },
  },
  6: {
    perRound: 8,
    total: 80,
    perLevel: {
      1: 32,
      2: 24,
      3: 24,
    },
  },
  7: {
    perRound: 9,
    total: 90,
    perLevel: {
      1: 36,
      2: 27,
      3: 27,
    },
  },
  8: {
    perRound: 10,
    total: 100,
    perLevel: {
      1: 40,
      2: 30,
      3: 30,
    },
  },
};
