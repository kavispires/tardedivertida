// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Internal
import type { Direction, MapSegment, PlayerMapping, Point, TreeId } from './types';
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
  const result = toX - fromX + (toY - fromY) * FOREST_WIDTH;
  if (result === 1) return DIRECTIONS.RIGHT;
  if (result === -1) return DIRECTIONS.LEFT;
  if (result === FOREST_WIDTH) return DIRECTIONS.DOWN;
  if (result === -FOREST_WIDTH) return DIRECTIONS.UP;
  if (result === FOREST_WIDTH + 1) return DIRECTIONS.DOWN_RIGHT;
  if (result === FOREST_WIDTH - 1) return DIRECTIONS.DOWN_LEFT;
  if (result === -FOREST_WIDTH + 1) return DIRECTIONS.UP_RIGHT;
  if (result === -FOREST_WIDTH - 1) return DIRECTIONS.UP_LEFT;
  return DIRECTIONS.UP;
};

/**
 * Get the available segments from a tree
 * @param origin - the origin tree Id
 * @param usedIndexes any other tree Ids that are already used
 * @returns - the available tree Ids
 */
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
  // Top-Left
  const topLeft: Point = [x - 1, y - 1];
  const topLeftIndex = getIndex(topLeft);
  if (topLeft[0] >= 0 && topLeft[1] >= 0 && !usedIndexes.includes(topLeftIndex)) {
    available.push(topLeft);
  }
  // Top-Right
  const topRight: Point = [x + 1, y - 1];
  const topRightIndex = getIndex(topRight);
  if (topRight[0] < FOREST_WIDTH && topRight[1] >= 0 && !usedIndexes.includes(topRightIndex)) {
    available.push(topRight);
  }
  // Down-Left
  const downLeft: Point = [x - 1, y + 1];
  const downLeftIndex = getIndex(downLeft);
  if (downLeft[0] >= 0 && downLeft[1] < FOREST_HEIGHT && !usedIndexes.includes(downLeftIndex)) {
    available.push(downLeft);
  }
  // Down-Right
  const downRight: Point = [x + 1, y + 1];
  const downRightIndex = getIndex(downRight);
  if (downRight[0] < FOREST_WIDTH && downRight[1] < FOREST_HEIGHT && !usedIndexes.includes(downRightIndex)) {
    available.push(downRight);
  }
  return available.map((point) => getIndex(point));
};

/**
 * Get the possible tree Ids for the next segment
 * @param fullMap - the full map of segments
 * @param currentSegment - the current segment
 */
export const getPossibleTreeIds = (fullMap: MapSegment[], currentSegment?: MapSegment): TreeId[] => {
  if (!currentSegment) return [];

  const usedTrees = fullMap.filter((segment) => segment.passed).map((segment) => segment.treeId);

  return getAvailableSegments(currentSegment.previousTree ?? currentSegment.treeId, usedTrees).filter(
    (treeId) => treeId !== currentSegment.treeId,
  );
};

/**
 * Build dictionary of treeIds to playerIds showing players that have passed through a tree
 * @param players
 * @param activePlayer
 * @returns
 */
export const buildPlayerMapping = (players: GamePlayers, activePlayer: GamePlayer): PlayerMapping => {
  // Segments that are active for the current player's map
  const currentMap = activePlayer.map as MapSegment[];
  const activeSegments = currentMap.filter((segment) => segment.active);

  const playerMapping: PlayerMapping = {};

  if (activeSegments[0].index > 0) {
    const startingSegment = currentMap[activeSegments[0].index - 1];
    playerMapping[startingSegment.treeId] = Object.keys(players).filter(
      (playerId) => playerId !== activePlayer.id,
    );
  }

  Object.values(players).forEach((player) => {
    const historyEntry = player.history[activePlayer.id];
    if (historyEntry) {
      activeSegments.forEach((segment, index, arr) => {
        const treeIds: TreeId[] = historyEntry[segment.index];

        if (treeIds) {
          // The last segment should display every player that has passed through it
          if (index === arr.length - 1) {
            treeIds.forEach((treeId) => {
              if (playerMapping[treeId] === undefined) {
                playerMapping[treeId] = [];
              }
              playerMapping[treeId].push(player.id);
            });
          } else {
            // Any other segment, only show the latest try
            const lastTreeId = treeIds?.[treeIds.length - 1];
            if (playerMapping[lastTreeId] === undefined) {
              playerMapping[lastTreeId] = [];
            }
            playerMapping[lastTreeId].push(player.id);
          }
        }
      });
    }
  });

  return playerMapping;
};

/**
 * Build dictionary of treeIds to playerIds showing what trees the user has tried in the latest segment
 * @param players
 * @param activePlayer
 * @returns
 */
export const buildUserMappingForLatestTree = (
  user: GamePlayer,
  currentMap: MapSegment[],
  activePlayerId: PlayerId,
): PlayerMapping => {
  // Segments that are active for the current player's map

  const activeSegment = currentMap[0];

  const playerMapping: PlayerMapping = {};

  const historyEntry = user.history[activePlayerId];
  if (historyEntry) {
    const treeIds: TreeId[] = historyEntry[activeSegment.index];

    if (treeIds) {
      treeIds.forEach((treeId) => {
        if (playerMapping[treeId] === undefined) {
          playerMapping[treeId] = [];
        }
        playerMapping[treeId].push(user.id);
      });
    }
  }

  return playerMapping;
};

/**
 * Build dictionary of treeIds to playerIds showing where players made a mistake
 * @param players
 * @param activePlayer
 * @returns
 */
export const buildPlayerMappingForLatestTree = (
  players: GamePlayers,
  activePlayer: GamePlayer,
): PlayerMapping => {
  // Segments that are active for the current player's map
  const currentMap = (activePlayer.map ?? []) as MapSegment[];
  const activeSegments = currentMap.filter((segment) => !segment.passed);

  const playerMapping: PlayerMapping = {};

  Object.values(players).forEach((player) => {
    const historyEntry = player.history[activePlayer.id];
    if (historyEntry) {
      activeSegments.forEach((segment, index, arr) => {
        const treeIds: TreeId[] = historyEntry[segment.index];

        if (treeIds) {
          // The last segment should display every player that has passed through it
          if (index === arr.length - 1) {
            treeIds.forEach((treeId) => {
              if (playerMapping[treeId] === undefined) {
                playerMapping[treeId] = [];
              }
              playerMapping[treeId].push(player.id);
            });
          } else {
            // Any other segment, only show the latest try
            const lastTreeId = treeIds?.[treeIds.length - 1];
            if (playerMapping[lastTreeId] === undefined) {
              playerMapping[lastTreeId] = [];
            }
            playerMapping[lastTreeId].push(player.id);
          }
        }
      });
    }
  });

  return playerMapping;
};
