// Internal
import type { Direction } from './types';

export const LABIRINTO_SECRETO_PHASES = {
  MAP_BUILDING: 'MAP_BUILDING',
  PATH_FOLLOWING: 'PATH_FOLLOWING',
  RESULTS: 'RESULTS',
} as const;

export const LABIRINTO_SECRETO_ACTIONS = {
  SUBMIT_MAP: 'SUBMIT_MAP',
  SUBMIT_PATH: 'SUBMIT_PATH',
} as const;

export const FOREST_WIDTH = 7;
export const FOREST_HEIGHT = 7;

export const DIRECTIONS: Record<string, Direction> = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  UP_LEFT: 'UP_LEFT',
  UP_RIGHT: 'UP_RIGHT',
  DOWN_LEFT: 'DOWN_LEFT',
  DOWN_RIGHT: 'DOWN_RIGHT',
};

export const SLIDE_DURATION = 15;
