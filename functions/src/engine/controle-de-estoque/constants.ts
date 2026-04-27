export const CONTROLE_DE_ESTOQUE_PHASES = {
  SETUP: 'SETUP',
  // PHASE ONE
  THE_WAREHOUSE: 'THE_WAREHOUSE',
  // PHASE TWO
  GOOD_PLACEMENT: 'GOOD_PLACEMENT',
  PLACEMENT_CONFIRMATION: 'PLACEMENT_CONFIRMATION',
  // PHASE THREE
  FULFILLMENT: 'FULFILLMENT',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

export const CONTROLE_DE_ESTOQUE_ACTIONS = {
  PLACE_GOOD: 'PLACE_GOOD',
  CONFIRM_PLACEMENT: 'CONFIRM_PLACEMENT',
  FULFILL_ORDER: 'FULFILL_ORDER',
  COMPLETE_FULFILLMENT: 'COMPLETE_FULFILLMENT',
} as const;

export const CONTROLE_DE_ESTOQUE_ACHIEVEMENTS = {
  MOST_FULFILLMENT_ATTEMPTS: 'MOST_FULFILLMENT_ATTEMPTS',
  FEWEST_FULFILLMENT_ATTEMPTS: 'FEWEST_FULFILLMENT_ATTEMPTS',
  MOST_FULFILLED_AT_ONCE: 'MOST_FULFILLED_AT_ONCE',
  MOST_SKIPPED_GOODS: 'MOST_SKIPPED_GOODS',
  MOST_OUT_OF_STOCK_GOODS: 'MOST_OUT_OF_STOCK_GOODS',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 7,
} as const;

export const MIN_ROUNDS = 5;
export const TOTAL_ROUNDS = 5;

export const GOODS_LIBRARY_COUNT = 256;
export const WAREHOUSE_SIZE = 7;

export const OUTCOME = {
  NEW_IDEA: 'NEW_IDEA',
  CONTINUE: 'CONTINUE',
  END_PHASE: 'END_PHASE',
} as const;

export const EVENT_TYPE = {
  CONCEAL: 'CONCEAL',
  PLACE_THEN_CONCEAL: 'PLACE_THEN_CONCEAL',
  REVEAL: 'REVEAL',
} as const;

export const COUNTS_BY_PLAYER_COUNT = {
  2: {
    players: 2,
    initialGoods: 5,
    goodsOnFirstRound: 6,
    goodsPerRound: 6,
    total: 35, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 11, // so total orders is a multiple of 2
  },
  3: {
    players: 3,
    initialGoods: 5,
    goodsOnFirstRound: 6,
    goodsPerRound: 6,
    total: 35, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 10, // so total orders is a multiple of 3
  },
  4: {
    players: 4,
    initialGoods: 5,
    goodsOnFirstRound: 4,
    goodsPerRound: 6,
    total: 33, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 12, // so total orders is a multiple of 4
  },
  5: {
    players: 5,
    initialGoods: 5,
    goodsOnFirstRound: 5,
    goodsPerRound: 5,
    total: 30, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 15, // so total orders is a multiple of 5
  },
  6: {
    players: 6,
    initialGoods: 5,
    goodsOnFirstRound: 6,
    goodsPerRound: 6,
    total: 35, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 12, // so total orders is a multiple of 6
  },
  7: {
    players: 7,
    initialGoods: 3,
    goodsOnFirstRound: 7,
    goodsPerRound: 7,
    total: 39, // goodsOnFirstRound + (goodsPerRound * rounds - 1) + initialGoods
    outOfStock: 14, // so total orders is a multiple of 7
  },
} as const;

export const STARTING_GOODS_CELLS = [
  [3, 3],
  [1, 1],
  [1, 5],
  [5, 1],
  [5, 5],
];
