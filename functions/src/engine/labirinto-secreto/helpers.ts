// Types
import type {
  Direction,
  FirebaseStoreData,
  LabirintoSecretoAchievement,
  MapSegment,
  Point,
  Tree,
} from './types';
// Constants
import {
  CARDS_PER_PLAYER,
  DEFAULT_PATHS,
  DIRECTIONS,
  FORBIDDEN_TREES,
  FORBIDDEN_CELLS,
  FOREST_HEIGHT,
  FOREST_WIDTH,
  LABIRINTO_SECRETO_ACHIEVEMENTS,
  LABIRINTO_SECRETO_PHASES,
  PATH_DISTANCE,
  STARTING_CARDS,
  TREE_TYPE_BY_ID,
} from './constants';
// Utils
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import { random, sample, shuffle } from 'lodash';

export const determineGameOver = (players: Players) => {
  // After 5 rounds or all paths are completed
  return utils.players
    .getListOfPlayers(players)
    .every((player) => player?.map && getIsPlayerMapComplete(player));
};

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  isGameOver?: boolean,
  turnOrder?: TurnOrder,
  activePlayerId?: UID,
): string => {
  const { SETUP, MAP_BUILDING, PATH_FOLLOWING, RESULTS, GAME_OVER } = LABIRINTO_SECRETO_PHASES;
  const order = [SETUP, MAP_BUILDING, PATH_FOLLOWING, RESULTS];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === PATH_FOLLOWING) {
    return utils.helpers.getLastItem(turnOrder ?? []) === activePlayerId ? RESULTS : PATH_FOLLOWING;
  }

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : MAP_BUILDING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

// FOREST FUNCTIONS

/**
 * Check if a point is on the edge of the forest
 * @param point - point to check
 * @returns - true if point is on the edge
 */
const checkEdge = (point: Point): boolean => {
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
const getIndex = (point: Point): number => {
  const [x, y] = point;
  return x + y * FOREST_WIDTH;
};

/**
 * Get the point of an index in the forest
 * @param index
 * @returns
 */
const getPoint = (index: number): Point => {
  const x = index % FOREST_WIDTH;
  const y = Math.floor(index / FOREST_WIDTH);
  return [x, y];
};

/**
 * Get the entry points of the forest
 * @returns - array of entry points
 */
const getEntryPoints = () => {
  const entryPoints: Point[] = [];
  const maxX = FOREST_WIDTH - 1;
  const maxY = FOREST_HEIGHT - 1;

  // Define forbidden corners (corners + adjacent)
  const forbiddenCorners: Point[] = [
    [0, 0],
    [1, 0],
    [0, 1], // Top-Left
    [maxX, 0],
    [maxX - 1, 0],
    [maxX, 1], // Top-Right
    [0, maxY],
    [0, maxY - 1],
    [1, maxY], // Bottom-Left
    [maxX, maxY],
    [maxX - 1, maxY],
    [maxX, maxY - 1], // Bottom-Right
  ];

  for (let x = 0; x < FOREST_WIDTH; x++) {
    for (let y = 0; y < FOREST_HEIGHT; y++) {
      const point: Point = [x, y];
      const isEdge = checkEdge(point);

      // REMOVED: index % 2 === 1 check.
      // This increases valid start points from 4 to 12.
      const isForbidden = forbiddenCorners.some(([fx, fy]) => fx === x && fy === y);

      if (isEdge && !isForbidden) {
        entryPoints.push(point);
      }
    }
  }
  return entryPoints;
};

/**
 * Check if a point is in the forbidden cells list
 * @param point - point to check
 * @returns - true if point is forbidden
 */
const isForbiddenCell = (point: Point): boolean => {
  return FORBIDDEN_CELLS.some(([fx, fy]) => fx === point[0] && fy === point[1]);
};

const getAvailableNextStep = (
  point: Point,
  usedIndexes: number[],
  startingPoints: Point[],
  isLastStep: boolean,
  avoidIndexes: number[] = [], // New parameter
): Point | null => {
  const [x, y] = point;

  // Helper to check if a point is valid
  const isValid = (p: Point) => {
    const [px, py] = p;
    const pIndex = getIndex(p);

    // Basic bounds and forbidden cell checks
    if (px < 0 || px >= FOREST_WIDTH || py < 0 || py >= FOREST_HEIGHT) return false;
    if (isForbiddenCell(p)) return false;

    // 1. Self-collision check (standard)
    if (usedIndexes.includes(pIndex)) return false;

    // 2. Start point blocking check (standard)
    if (!isLastStep && startingPoints.some(([sx, sy]) => sx === px && sy === py)) return false;

    // 3. NEW: Dynamic collision check (other players)
    if (avoidIndexes.includes(pIndex)) return false;

    return true;
  };

  const available: Point[] = [];

  // Check all 8 directions
  const candidates: Point[] = [
    [x, y - 1], // Up
    [x + 1, y], // Right
    [x, y + 1], // Down
    [x - 1, y], // Left
    [x - 1, y - 1], // Top-Left
    [x + 1, y - 1], // Top-Right
    [x - 1, y + 1], // Down-Left
    [x + 1, y + 1], // Down-Right
  ];

  candidates.forEach((cand) => {
    if (isValid(cand)) available.push(cand);
  });

  if (available.length === 0) return null;
  return sample(available) ?? null;
};

const WHILE_THRESHOLD = 300;

/**
 * Build a path through the forest. The path never loops back on itself.
 * @param startingPoint - point to start the path from
 * @param startingPoints - all possible starting points
 * @param length - length of the path
 * @returns - array of points representing the path
 */
const buildPath = (
  startingPoint: Point,
  startingPoints: Point[],
  existingOccupiedIndexes: number[] = [], // New parameter
  length = PATH_DISTANCE,
): Point[] => {
  let segments: Point[] = [startingPoint];
  let usedIndexes: number[] = [getIndex(startingPoint)];
  let attempts = 0;

  // Threshold for "giving up" on avoiding other players
  // If we try 75 times and fail, we allow crossing over.
  const STRICT_MODE_THRESHOLD = WHILE_THRESHOLD / 2;

  while (segments.length < length && attempts < WHILE_THRESHOLD) {
    const currentPoint = segments[segments.length - 1];
    const isLastStep = segments.length === length - 1;

    // LOGIC: If we are under 50% tries, strictly avoid existing paths.
    // If we are over 50%, send an empty array [] to allow crossing.
    const currentAvoidList = attempts < STRICT_MODE_THRESHOLD ? existingOccupiedIndexes : [];

    const availableSegment = getAvailableNextStep(
      currentPoint,
      usedIndexes,
      startingPoints,
      isLastStep,
      currentAvoidList,
    );

    if (availableSegment) {
      segments.push(availableSegment);
      usedIndexes.push(getIndex(availableSegment));
    } else {
      // Dead end: Reset
      segments = [startingPoint];
      usedIndexes = [getIndex(startingPoint)];
      attempts++;
    }
  }

  // Fallback to defaults if generation failed completely
  if (segments.length < length) {
    const startIndex = getIndex(startingPoint);
    const defaultPathIndices = DEFAULT_PATHS[startIndex];

    if (defaultPathIndices) {
      return defaultPathIndices.map((p) => [p[0], p[1]] as Point);
    }

    // Last resort safety
    return utils.helpers.makeArray(length).map(() => startingPoint);
  }

  return segments;
};

/**
 * Builds forest
 * @param cards
 * @returns
 */
export const buildForest = (cards: TextCard[], isItemsForest: boolean): Tree[] => {
  const trees = Array(5)
    .fill(0)
    .map(() => random(2, 15));

  return utils.helpers.makeArray(FOREST_WIDTH * FOREST_HEIGHT, 0).map((el: number, index) => {
    if (FORBIDDEN_TREES.includes(index)) {
      return {
        id: el,
        treeType: 0,
        card: { id: 'forbidden', text: '' },
        point: getPoint(index),
        blocked: true,
      };
    }

    return {
      id: el,
      treeType: isItemsForest ? cards[index].id : trees[TREE_TYPE_BY_ID[index]],
      card: cards[index],
      point: getPoint(index),
    };
  });
};

/**
 * Builds paths for players
 * @param players
 */
export const buildPaths = (players: Players) => {
  const entryPoints = getEntryPoints();

  // We need to store all cells used by ALL generated paths so far
  let globalUsedIndexes: number[] = [];
  const generatedPaths: Point[][] = [];

  // Shuffle entry points so we don't always prioritize the top-left player for the "cleanest" path
  const shuffledEntries = shuffle(entryPoints);

  // Generate paths sequentially
  shuffledEntries.forEach((entryPoint) => {
    const path = buildPath(entryPoint, entryPoints, globalUsedIndexes);

    if (path && path.length >= PATH_DISTANCE) {
      generatedPaths.push(path);
      // Add this path's cells to the global block list
      // We map to indices and filter out duplicates to keep the array clean
      const pathIndices = path.map((p) => getIndex(p));
      globalUsedIndexes = [...new Set([...globalUsedIndexes, ...pathIndices])];
    }
  });

  // Assign to players
  if (generatedPaths.length < utils.players.getPlayerCount(players)) {
    utils.helpers.print(
      `Warning: Only generated ${generatedPaths.length} valid paths for ${utils.players.getPlayerCount(players)} players.`,
    );
  }

  // Shuffle the valid paths again before assigning to ensure fairness
  const finalPaths = shuffle(generatedPaths);

  utils.players.getListOfPlayers(players).forEach((player, playerIndex) => {
    const path = finalPaths[playerIndex];

    // Safety check if we have more players than paths
    if (!path) {
      player.map = []; // Or handle error
      return;
    }

    player.map = utils.helpers
      .makeArray(PATH_DISTANCE)
      .map((_, index) => {
        // Safety: Ensure current point exists
        if (!path[index]) return null;

        const treeId = getIndex(path[index]);

        const nextPoint = path[index + 1];
        const nextTree = nextPoint ? getIndex(nextPoint) : null;

        const prevPoint = path[index - 1];
        const previousTree = prevPoint ? getIndex(prevPoint) : null;

        const segment: MapSegment = {
          index,
          playerId: player.id,
          treeId,
          passed: index === 0,
          score: 0,
          previousTree,
          nextTree,
          direction: determineDirection(treeId, nextTree),
          clues: [],
          playersIds: [],
          active: false,
        };
        return segment;
      })
      .filter((s): s is MapSegment => s !== null);
  });
};

const determineDirection = (currentTree: number, nextTree?: number | null): Direction | null => {
  if (nextTree === null || nextTree === undefined) return null;
  if (nextTree - currentTree === 1) return DIRECTIONS.RIGHT as Direction;
  if (nextTree - currentTree === -1) return DIRECTIONS.LEFT as Direction;
  if (nextTree - currentTree === 7) return DIRECTIONS.DOWN as Direction;
  if (nextTree - currentTree === -7) return DIRECTIONS.UP as Direction;
  if (nextTree - currentTree === -6) return DIRECTIONS.UP_LEFT as Direction;
  if (nextTree - currentTree === -8) return DIRECTIONS.UP_RIGHT as Direction;
  if (nextTree - currentTree === 6) return DIRECTIONS.DOWN_LEFT as Direction;
  if (nextTree - currentTree === 8) return DIRECTIONS.DOWN_RIGHT as Direction;
  return null;
};

const determineDirectionAchievement = (currentTree: number, nextTree: number) => {
  const direction = determineDirection(currentTree, nextTree);
  return direction?.toLowerCase();
};

export const distributeCards = (store: PlainObject, players: Players, cards: TextCard[]) => {
  // Builds a 18 card deck per player
  utils.deck.setup(store, players, cards, CARDS_PER_PLAYER);
  // Deals the first 3 cards
  utils.deck.deal(store, players, STARTING_CARDS);
};

export const getRankingAndProcessScoring = (players: Players, store: FirebaseStoreData) => {
  // Gained points index: [Correct guesses, from other players]
  const scores = new utils.players.Scores(players, [0, 0]);
  const listOfPlayers = utils.players.getListOfPlayers(players);

  listOfPlayers.forEach((activePlayer) => {
    if (!getIsPlayerMapComplete(activePlayer)) {
      // Get only active segments (not passed and with clues)
      const currentMap = activePlayer.map.filter(
        (segment: MapSegment) => !segment.passed && segment.clues.length > 0,
      );

      // Build an empty array of with the same length as the current map
      const correct: UID[][] = currentMap.map(() => []);

      // Count correct guesses for each non-active player
      listOfPlayers.forEach((player) => {
        if (player.id !== activePlayer.id) {
          const guesses: number[] = player.guesses[activePlayer.id];

          // Achievement: Distance
          utils.achievements.increase(store, player.id, 'distance', guesses.length);

          for (let i = 0; i < guesses.length; i++) {
            const guess = guesses[i];

            // Achievement: determine direction
            const achievementDirection = determineDirectionAchievement(guesses[i - 1], guess);
            if (achievementDirection) {
              utils.achievements.increase(store, player.id, achievementDirection, 1);
            }

            // Add to history
            if (player.history[activePlayer.id] === undefined) {
              player.history[activePlayer.id] = {};
            }
            const segment = currentMap[i];
            // Is the guess correct?
            if (guess === currentMap[i].treeId) {
              currentMap[i].passed = true;
              correct[i].push(player.id);
              currentMap[i].playersIds.push(player.id);

              player.history[activePlayer.id][segment.index] = [guess];

              // Achievement: guider
              utils.achievements.increase(store, player.id, 'guided', 1);
              utils.achievements.increase(store, activePlayer.id, 'guide', 1);
            } else {
              player.history[activePlayer.id][segment.index] = [
                ...(player.history[activePlayer.id][segment.index] ?? []),
                guess,
              ];

              break;
            }
          }
        }
      });

      const playerCount = listOfPlayers.length;

      // Award points depending on the number of correct guesses
      correct.forEach((tree: UID[], index) => {
        const correctGuesses = tree.length;
        // Only one person guessed correctly
        if (correctGuesses === 1) {
          const points = playerCount;
          scores.add(tree[0], points, 0);
          scores.add(activePlayer.id, points, 1);
          currentMap[index].score = points;
        } else if (correctGuesses > 0) {
          // Multiple people guessed correctly
          const points = correctGuesses;
          tree.forEach((playerId) => {
            scores.add(playerId, points, 0);
          });
          scores.add(activePlayer.id, points, 1);
          currentMap[index].score = points;
        }
      });
    }
  });

  return scores.rank(players);
};

/**
 * In the beginning of each round, find the furthest tree a player has reached and moved all players there
 * @param players
 */
export const updateMaps = (players: Players) => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  listOfPlayers.forEach((activePlayer) => {
    const furthestPlayerIndex = activePlayer.map.reduce(
      (lastIndex: number, segment: MapSegment, index: number) => {
        if (segment.playersIds.length > 0) {
          return index;
        }
        return lastIndex;
      },
      0,
    );

    // Remove players from anywhere on the map and add them to the furthest player point
    activePlayer.map.forEach((segment: MapSegment) => {
      if (segment.index === furthestPlayerIndex) {
        segment.playersIds = listOfPlayers
          .filter((player) => player.id !== activePlayer.id)
          .map((player) => player.id);
      } else {
        segment.playersIds = [];
      }
    });
  });
};

export const getAllCompletePlayerIds = (players: Players): UID[] => {
  return utils.players
    .getListOfPlayers(players)
    .filter((player) => getIsPlayerMapComplete(player))
    .map((player) => player.id);
};

export const getPlayersWhoHaveNotCompletedTheirMaps = (players: Players): Player[] => {
  return utils.players.getListOfPlayers(players).filter((player) => !getIsPlayerMapComplete(player));
};

export const getIsPlayerMapComplete = (player: Player): boolean => {
  return player.map.every((segment: MapSegment) => segment.passed);
};

export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<LabirintoSecretoAchievement>[] = [];

  // Most and Fewest adjectives
  const { most: mostAdjectives, least: leastAdjectives } = utils.achievements.getMostAndLeastOf(
    store,
    'adjectives',
  );
  if (mostAdjectives) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.MOST_CARDS,
      playerId: mostAdjectives.playerId,
      value: mostAdjectives.value,
    });
  }
  if (leastAdjectives) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.FEWEST_CARDS,
      playerId: leastAdjectives.playerId,
      value: leastAdjectives.value,
    });
  }

  // Most and Fewest negative adjectives
  const { most: mostNegativeAdjectives, least: leastNegativeAdjectives } =
    utils.achievements.getMostAndLeastOf(store, 'negatives');
  if (mostNegativeAdjectives) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.MOST_NEGATIVE_CARDS,
      playerId: mostNegativeAdjectives.playerId,
      value: mostNegativeAdjectives.value,
    });
  }
  if (leastNegativeAdjectives) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.FEWEST_NEGATIVE_CARDS,
      playerId: leastNegativeAdjectives.playerId,
      value: leastNegativeAdjectives.value,
    });
  }

  // Most and Fewest trees
  const { most: mostTrees, least: leastTrees } = utils.achievements.getMostAndLeastOf(store, 'distance');
  if (mostTrees) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.MOST_TREES,
      playerId: mostTrees.playerId,
      value: mostTrees.value,
    });
  }
  if (leastTrees) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.FEWEST_TREES,
      playerId: leastTrees.playerId,
      value: leastTrees.value,
    });
  }

  // Best and Worst map
  const { most: bestMap, least: worstMap } = utils.achievements.getMostAndLeastOf(store, 'guided');
  if (bestMap) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.BEST_MAP,
      playerId: bestMap.playerId,
      value: bestMap.value,
    });
  }
  if (worstMap) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.WORST_MAP,
      playerId: worstMap.playerId,
      value: worstMap.value,
    });
  }

  // Best and Worst scout
  const { most: bestScout, least: worstScout } = utils.achievements.getMostAndLeastOf(store, 'guide');
  if (bestScout) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.BEST_SCOUT,
      playerId: bestScout.playerId,
      value: bestScout.value,
    });
  }
  if (worstScout) {
    achievements.push({
      type: LABIRINTO_SECRETO_ACHIEVEMENTS.WORST_SCOUT,
      playerId: worstScout.playerId,
      value: worstScout.value,
    });
  }

  // Most directions
  const directions = ['up', 'right', 'down', 'left', 'up_left', 'up_right', 'down_left', 'down_right'];
  directions.forEach((direction) => {
    const { most: mostDirection } = utils.achievements.getMostAndLeastOf(store, direction);
    if (mostDirection) {
      achievements.push({
        type: LABIRINTO_SECRETO_ACHIEVEMENTS[
          `MOST_${direction.toUpperCase()}` as LabirintoSecretoAchievement
        ],
        playerId: mostDirection.playerId,
        value: mostDirection.value,
      });
    }
  });

  return achievements;
};
