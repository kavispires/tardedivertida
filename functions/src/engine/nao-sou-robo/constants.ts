export const NAO_SOU_ROBO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  CARD_SELECTION: 'CARD_SELECTION',
  ARE_YOU_A_ROBOT: 'ARE_YOU_A_ROBOT',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
};

export const NAO_SOU_ROBO_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
};

export const NAO_SOU_ROBO_ACHIEVEMENTS = {
  MOST_ROBOT: 'MOST_ROBOT',
  LEAST_ROBOT: 'LEAST_ROBOT',
  MOST_ALONE_CORRECT: 'MOST_ALONE_CORRECT',
  MOST_ALONE_ROBOT: 'MOST_ALONE_ROBOT',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 8,
};

export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  TOO_SUSPICIOUS: 'TOO_SUSPICIOUS',
  ROBOT_WINS: 'ROBOT_WINS',
  HUMANS_WIN: 'HUMANS_WIN',
};

export const MAX_ROUNDS = 10;

export const CARDS_PER_PLAYER = 8;

export const DECK_PER_PLAYER = MAX_ROUNDS + CARDS_PER_PLAYER;

export const ROUND_TYPES = ['colors', 'emotions', 'glyphs', 'words', 'emojis', 'warehouse-goods', 'words'];

export const GOODS_LIBRARY_COUNT = 256;

export const MIN_ROUND_CARDS = 9;

export const ROBOT_GOAL_BY_PLAYER_COUNT = {
  2: 20,
  3: 20,
  4: 20,
  5: 15,
  6: 15,
  7: 8,
  8: 5,
};

export const SUSPICION_THRESHOLD = 3;

export const BEAT_THRESHOLD = 3;
