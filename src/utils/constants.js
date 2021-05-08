/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL = {
  BANNERS: `${process.env.PUBLIC_URL}/images/banners/`,
  RULES: `${process.env.PUBLIC_URL}/images/rules/`,
};

/**
 * List of tags translation and color
 */
export const TAG_DICT = {
  competitive: {
    label: 'competitivo',
    color: 'red',
  },
  cooperative: {
    label: 'cooperativo',
    color: 'green',
  },
  traitor: {
    label: 'inimigo',
    color: 'volcano',
  },
  'real-time': {
    label: 'juntos',
    color: 'volcano',
  },
  'turn-based': {
    label: 'vez',
    color: 'volcano',
  },
  timed: {
    label: 'tempo',
    color: 'orange',
  },
  drawing: {
    label: 'desenho',
    color: 'gold',
  },
  guessing: {
    label: 'adivinhar',
    color: 'cyan',
  },
  writing: {
    label: 'escrever',
    color: 'blue',
  },
  images: {
    label: 'imagens',
    color: 'purple',
  },
  discussion: {
    label: 'discussão/fala',
    color: 'geekblue',
  },
};

/**
 * List of avatar ids
 */
export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => i + index);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const AVATAR_DESCRIPTIONS_BR = {
  0: 'o axolote',
  1: 'a tartaruga',
  2: 'a raposa',
  3: 'o sapo',
  4: 'a salamandra',
  5: 'a toupeira',
  6: 'o esquilo',
  7: 'o corvo',
  8: 'a lontra',
  9: 'o camundongo',
  10: 'o sabiá',
  11: 'a cojura',
  12: 'o porco-espinho',
  13: 'o ornitorrinco',
  14: 'o rato',
  15: 'a rã',
  16: 'o caramujo',
  17: 'a abelha',
  18: 'o morcego',
  19: 'o gato',
  20: 'o coelho',
  21: 'a aranha',
  22: 'a borboleta',
  23: 'o arminho',
  24: 'o porco',
};

/**
 * Enum of available games
 */
export const GAME_COLLECTION = {
  ARTE_RUIM: 'arte-ruim',
  UM_SO: 'um-so',
};

/**
 * Enum of Arte Ruim phases
 */
export const ARTE_RUIM_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
};

/**
 * Enum of Um Só phases
 */
export const UM_SO_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  WORD_SELECTION: 'WORD_SELECTION',
  SUGGEST: 'SUGGEST',
  COMPARE: 'COMPARE',
  GUESS: 'GUESS',
  GAME_OVER: 'GAME_OVER',
};
