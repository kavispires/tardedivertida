// Types
import type { Level4Type } from './types';

/**
 * Phase identifiers used by the `arte-ruim` engine.
 */
export const ARTE_RUIM_PHASES = {
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  EVALUATION: 'EVALUATION',
  GALLERY: 'GALLERY',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `arte-ruim` engine.
 */
export const ARTE_RUIM_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_VOTING: 'SUBMIT_VOTING',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 10;

/**
 * The default sequence of drawing difficulty levels.
 */
export const DEFAULT_LEVELS = [1, 2, 3, 4, 5];

/**
 * The level sequence used when only basic drawing levels are enabled.
 */
export const BASIC_LEVELS = [1, 2, 3, 1, 2, 3];

/**
 * Score goals indexed by player count for the points-based game option.
 */
export const GAME_OVER_SCORE_THRESHOLD = [20, 20, 20, 30, 30, 50, 50, 75, 75, 100];

/**
 * Resource libraries available for special level-four drawing rounds.
 */
export const SPECIAL_LEVELS_LIBRARIES: Level4Type[] = ['adjectives', 'movies', 'contenders'];
