import type { Level4Type } from './types';

export const ARTE_RUIM_PHASES = {
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
} as const;

export const ARTE_RUIM_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_VOTING: 'SUBMIT_VOTING',
} as const;

export const ARTE_RUIM_ACHIEVEMENTS = {
  SOLITARY_LOSER: 'SOLITARY_LOSER',
  SOLITARY_WINNER: 'SOLITARY_WINNER',
  BEST_ARTIST: 'BEST_ARTIST',
  WORST_ARTIST: 'WORST_ARTIST',
  TABLE_VOTES: 'TABLE_VOTES',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

export const MAX_ROUNDS = 10;

export const DEFAULT_LEVELS = [1, 2, 3, 4, 5];

export const BASIC_LEVELS = [1, 2, 3, 1, 2, 3];

export const GAME_OVER_SCORE_THRESHOLD = [20, 20, 20, 30, 30, 50, 50, 75, 75, 100];

export const SPECIAL_LEVELS_LIBRARIES: Level4Type[] = ['adjectives', 'movies', 'contenders'];
