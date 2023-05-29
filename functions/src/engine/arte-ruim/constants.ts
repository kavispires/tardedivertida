import { Level5Type } from './types';

export const ARTE_RUIM_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
};

export const ARTE_RUIM_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_VOTING: 'SUBMIT_VOTING',
};

export const ARTE_RUIM_ACHIEVEMENTS = {
  SOLITARY_LOSER: 'SOLITARY_LOSER',
  SOLITARY_WINNER: 'SOLITARY_WINNER',
  BEST_ARTIST: 'BEST_ARTIST',
  WORST_ARTIST: 'WORST_ARTIST',
  TABLE_VOTES: 'TABLE_VOTES',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
};

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
};

export const MAX_ROUNDS = 10;

export const SHORT_GAME_LEVELS = [1, 2, 3, 4, 5];

export const DEFAULT_LEVELS = [1, 2, 3, 4, 5];

export const GAME_OVER_SCORE_THRESHOLD = [20, 20, 20, 30, 30, 50, 50, 75, 75, 100];

export const SPECIAL_LEVELS_LIBRARIES: Level5Type[] = ['adjectives', 'movies', 'contenders'];
