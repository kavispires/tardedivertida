export const ARTE_RUIM_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
};

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
};

export const MAX_ROUNDS = 10;
export const GAME_OVER_SCORE_THRESHOLD = 50;

export const REGULAR_GAME_OPTIONS = {
  MAX_ROUNDS: 10,
  DECK_ORDER_BY_LEVEL: [1, 2, 3, 4, 1, 2, 3, 4, 1, 4],
  CARDS_PER_PLAYER_COUNT: {
    3: {
      perRound: 7,
      total: 70,
      perLevel: {
        1: 21,
        2: 14,
        3: 14,
        4: 21,
      },
    },
    4: {
      perRound: 7,
      total: 70,
      perLevel: {
        1: 21,
        2: 14,
        3: 14,
        4: 21,
      },
    },
    5: {
      perRound: 7,
      total: 70,
      perLevel: {
        1: 21,
        2: 14,
        3: 14,
        4: 21,
      },
    },
    6: {
      perRound: 8,
      total: 80,
      perLevel: {
        1: 24,
        2: 16,
        3: 16,
        4: 24,
      },
    },
    7: {
      perRound: 9,
      total: 90,
      perLevel: {
        1: 27,
        2: 16,
        3: 16,
        4: 27,
      },
    },
    8: {
      perRound: 10,
      total: 100,
      perLevel: {
        1: 30,
        2: 20,
        3: 20,
        4: 30,
      },
    },
    9: {
      perRound: 10,
      total: 100,
      perLevel: {
        1: 30,
        2: 20,
        3: 20,
        4: 30,
      },
    },
    10: {
      perRound: 10,
      total: 100,
      perLevel: {
        1: 30,
        2: 20,
        3: 20,
        4: 30,
      },
    },
  },
};

export const SHORT_GAME_OPTIONS = {
  MAX_ROUNDS: 5,
  DECK_ORDER_BY_LEVEL: [1, 2, 3, 4, 4],
  CARDS_PER_PLAYER_COUNT: {
    3: {
      perRound: 7,
      total: 35,
      perLevel: {
        1: 7,
        2: 7,
        3: 7,
        4: 14,
      },
    },
    4: {
      perRound: 7,
      total: 35,
      perLevel: {
        1: 7,
        2: 7,
        3: 7,
        4: 14,
      },
    },
    5: {
      perRound: 7,
      total: 35,
      perLevel: {
        1: 7,
        2: 7,
        3: 7,
        4: 14,
      },
    },
    6: {
      perRound: 8,
      total: 40,
      perLevel: {
        1: 8,
        2: 8,
        3: 8,
        4: 16,
      },
    },
    7: {
      perRound: 9,
      total: 45,
      perLevel: {
        1: 9,
        2: 9,
        3: 9,
        4: 18,
      },
    },
    8: {
      perRound: 10,
      total: 50,
      perLevel: {
        1: 10,
        2: 10,
        3: 10,
        4: 20,
      },
    },
    9: {
      perRound: 10,
      total: 50,
      perLevel: {
        1: 10,
        2: 10,
        3: 10,
        4: 20,
      },
    },
    10: {
      perRound: 10,
      total: 50,
      perLevel: {
        1: 10,
        2: 10,
        3: 10,
        4: 20,
      },
    },
  },
};