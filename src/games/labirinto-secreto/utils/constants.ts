import { Direction } from './types';

export const FOREST_WIDTH = 7;
export const FOREST_HEIGHT = 5;

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

export const PAGE_DURATION = 15;
