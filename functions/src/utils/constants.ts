export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => i + index);

export const GAME_CODES = {
  A: 'A', // arte-ruim
  U: 'U', // ue-so-isso
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
  UE_SO_ISSO: 'ue-so-isso',
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

// ARTE RUIM

export const ARTE_RUIM_GOAL = 50;

export const ARTE_RUIM_CARDS_BY_LEVEL = {
  1: new Array(200).fill(1).map((i, index) => `${i + index}`),
  2: new Array(200).fill(201).map((i, index) => `${i + index}`),
  3: new Array(200).fill(401).map((i, index) => `${i + index}`),
};

// UM SO

export const UE_SO_ISSO_WORDS = new Array(600).fill(1).map((i, index) => `${i + index}`);
