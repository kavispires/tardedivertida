export const CONTROLE_DE_ESTOQUE_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  // PHASE ONE
  // BOSS_IDEA: 'BOSS_IDEA',
  GOOD_PLACEMENT: 'GOOD_PLACEMENT',
  PLACEMENT_CONFIRMATION: 'PLACEMENT_CONFIRMATION',
  // PHASE TWO
  FULFILLMENT: 'FULFILLMENT',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
};

export const CONTROLE_DE_ESTOQUE_ACTIONS = {
  PLACE_GOOD: 'PLACE_GOOD',
  CONFIRM_PLACEMENT: 'CONFIRM_PLACEMENT',
  FULFILL_ORDER: 'FULFILL_ORDER',
  COMPLETE_FULFILLMENT: 'COMPLETE_FULFILLMENT',
};

export const CONTROLE_DE_ESTOQUE_ACHIEVEMENTS = {
  MOST_FULFILLMENT_ATTEMPTS: 'MOST_FULFILLMENT_ATTEMPTS',
  FEWEST_FULFILLMENT_ATTEMPTS: 'FEWEST_FULFILLMENT_ATTEMPTS',
  MOST_FULFILLED_AT_ONCE: 'MOST_FULFILLED_AT_ONCE',
  MOST_SKIPPED_GOODS: 'MOST_SKIPPED_GOODS',
  MOST_OUT_OF_STOCK_GOODS: 'MOST_OUT_OF_STOCK_GOODS',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 7,
};

export const MIN_ROUNDS = 5;

export const GOODS_LIBRARY_COUNT = 256;
export const TOTAL_GOODS = 35;
export const OUT_OF_STOCK_GOODS = 14;
export const WAREHOUSE_SIZE = 7;