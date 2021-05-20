export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => i + index);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GAME_CODES = {
  A: 'A', // arte-ruim
  O: 'O', // onda-telepatica
  U: 'U', // ue-so-isso
};

export const GAME_KEYS = {
  ARTE_RUIM: 'ARTE_RUIM',
  ONDA_TELEPATICA: 'ONDA_TELEPATICA',
  UE_SO_ISSO: 'UE_SO_ISSO',
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
  ONDA_TELEPATICA: 'onda-telepatica',
  UE_SO_ISSO: 'ue-so-isso',
};

export const GAME_PLAYERS_LIMIT = {
  ARTE_RUIM: {
    min: 3,
    max: 8,
  },
  ONDA_TELEPATICA: {
    min: 4,
    max: 8,
  },
  UE_SO_ISSO: {
    min: 3,
    max: 8,
  },
};

/**
 * Enum of Game Phases
 */
export const PHASES = {
  ARTE_RUIM: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    DRAW: 'DRAW',
    EVALUATION: 'EVALUATION',
    GALLERY: 'GALLERY',
    GAME_OVER: 'GAME_OVER',
  },
  ONDA_TELEPATICA: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    DIAL_SIDES: 'DIAL_SIDES',
    DIAL_CLUE: 'DIAL_CLUE',
    GUESS: 'GUESS',
    RIVAL_GUESS: 'RIVAL_GUESS',
    REVEAL: 'REVEAL',
    GAME_OVER: 'GAME_OVER',
  },
  UE_SO_ISSO: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    WORD_SELECTION: 'WORD_SELECTION',
    SUGGEST: 'SUGGEST',
    COMPARE: 'COMPARE',
    GUESS: 'GUESS',
    GAME_OVER: 'GAME_OVER',
  },
};

// ARTE_RUIM

export const ARTE_RUIM_GOAL = 50;

export const ARTE_RUIM_CARDS_BY_LEVEL = {
  1: new Array(200).fill(1).map((i, index) => `${i + index}`),
  2: new Array(200).fill(201).map((i, index) => `${i + index}`),
  3: new Array(200).fill(401).map((i, index) => `${i + index}`),
};

// ONDA_TELEPATICA

export const ONDA_TELEPATICA_GOAL = 10;

// UE_SO_ISSO

export const UE_SO_ISSO_WORDS = new Array(600).fill(1).map((i, index) => `${i + index}`);
