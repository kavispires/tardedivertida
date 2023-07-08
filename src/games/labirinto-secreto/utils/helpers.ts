import { DIRECTIONS, FOREST_HEIGHT, FOREST_WIDTH } from './constants';

/**
 * Check if a point is on the edge of the forest
 * @param point - point to check
 * @returns - true if point is on the edge
 */
export const checkEdge = (point: Point): boolean => {
  const [x, y] = point;
  if (x === 0 || x === FOREST_WIDTH - 1 || y === 0 || y === FOREST_HEIGHT - 1) {
    return true;
  }
  return false;
};

/**
 * Get the index of a point in the forest
 * @param point - point to get index of
 * @returns - index of point
 */
export const getIndex = (point: Point): number => {
  const [x, y] = point;
  return x + y * FOREST_WIDTH;
};

/**
 * Get the point of an index in the forest
 * @param index
 * @returns
 */
export const getPoint = (index: number): Point => {
  const x = index % FOREST_WIDTH;
  const y = Math.floor(index / FOREST_WIDTH);
  return [x, y];
};

export const getOriginDirection = (index: TreeId): Direction | null => {
  const point = getPoint(index);
  const [x, y] = point;
  if (x === 0) return DIRECTIONS.LEFT;
  if (x === FOREST_WIDTH - 1) return DIRECTIONS.RIGHT;
  if (y === 0) return DIRECTIONS.UP;
  if (y === FOREST_HEIGHT - 1) return DIRECTIONS.DOWN;
  return null;
};

export const getDirection = (from: TreeId, to: TreeId): Direction => {
  const [fromX, fromY] = getPoint(from);
  const [toX, toY] = getPoint(to);
  if (fromX === toX) {
    if (fromY < toY) return DIRECTIONS.DOWN;
    return DIRECTIONS.UP;
  }
  if (fromX < toX) return DIRECTIONS.RIGHT;
  return DIRECTIONS.LEFT;
};

export const getAvailableSegments = (origin: TreeId, usedIndexes: TreeId[]): TreeId[] => {
  const [x, y] = getPoint(origin);
  const available: Point[] = [];
  // Top
  const top: Point = [x, y - 1];
  const topIndex = getIndex(top);
  if (top[1] >= 0 && !usedIndexes.includes(topIndex)) {
    available.push(top);
  }
  // Right
  const right: Point = [x + 1, y];
  const rightIndex = getIndex(right);
  if (right[0] < FOREST_WIDTH && !usedIndexes.includes(rightIndex)) {
    available.push(right);
  }
  // Down
  const down: Point = [x, y + 1];
  const downIndex = getIndex(down);
  if (down[1] < FOREST_HEIGHT && !usedIndexes.includes(downIndex)) {
    available.push(down);
  }
  // Left
  const left: Point = [x - 1, y];
  const leftIndex = getIndex(left);
  if (left[0] >= 0 && !usedIndexes.includes(leftIndex)) {
    available.push(left);
  }

  return available.map((point) => getIndex(point));
};
