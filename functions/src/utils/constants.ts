export const GAME_CODES = {
  A: 'A', // arte-ruim
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
};

export const ARTE_RUIM_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  RANKING: 'RANKING',
  GAME_OVER: 'GAME_OVER',
};

export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => i + index);

export const ARTE_RUIM_GOAL = 30;

export const ARTE_RUIM_CARDS_BY_LEVEL = {
  1: new Array(200).fill(1).map((i, index) => `${i + index}`),
  2: new Array(200).fill(201).map((i, index) => `${i + index}`),
  3: new Array(200).fill(401).map((i, index) => `${i + index}`),
};
