// Types
import { Direction, FirebaseStoreData, LabirintoSecretoAchievement, MapSegment, Point, Tree } from './types';
// Constants
import {
  CARDS_PER_PLAYER,
  DEFAULT_PATHS,
  DIRECTIONS,
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
import { TextCard } from '../../types/tdr';

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
  activePlayerId?: PlayerId
): string => {
  const { RULES, SETUP, MAP_BUILDING, PATH_FOLLOWING, RESULTS, GAME_OVER } = LABIRINTO_SECRETO_PHASES;
  const order = [RULES, SETUP, MAP_BUILDING, PATH_FOLLOWING, RESULTS];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === PATH_FOLLOWING) {
    return utils.game.getLastItem(turnOrder ?? []) === activePlayerId ? RESULTS : PATH_FOLLOWING;
  }

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : MAP_BUILDING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return MAP_BUILDING;
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
  for (let x = 0; x < FOREST_WIDTH; x++) {
    for (let y = 0; y < FOREST_HEIGHT; y++) {
      const isEdge = checkEdge([x, y]);
      const index = getIndex([x, y]);
      if (isEdge && index % 2 === 1) {
        entryPoints.push([x, y]);
      }
    }
  }
  return entryPoints;
};

const getAvailableNextStep = (point: Point, usedIndexes: number[]): Point => {
  const [x, y] = point;
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

  return utils.game.getRandomItem(available);
};

const WHILE_THRESHOLD = 150;

/**
 * Build a path through the forest. The path never loops back on itself.
 * @param startingPoint - point to start the path from
 * @param length - length of the path
 * @returns - array of points representing the path
 */
const buildPath = (startingPoint: Point, length = PATH_DISTANCE): Point[] => {
  let segments: Point[] = [startingPoint];
  let usedIndexes: number[] = [getIndex(startingPoint)];
  let limit = 0;

  while (segments.length < length && limit < WHILE_THRESHOLD) {
    for (let s = 0; s < length; s++) {
      const availableSegment = getAvailableNextStep(segments[s], usedIndexes);
      if (availableSegment) {
        segments.push(availableSegment);
        usedIndexes.push(getIndex(availableSegment));
      } else {
        segments = [startingPoint];
        usedIndexes = [getIndex(startingPoint)];
        limit++;

        break;
      }
    }
  }

  if (limit >= WHILE_THRESHOLD) {
    return DEFAULT_PATHS[getIndex(startingPoint)];
  }

  return segments;
};

/**
 * Builds forest
 * @param cards
 * @returns
 */
export const buildForest = (cards: TextCard[]): Tree[] => {
  const trees = Array(5)
    .fill(0)
    .map(() => utils.game.getRandomNumber(1, 15));

  return utils.game.makeArray(FOREST_WIDTH * FOREST_HEIGHT, 0).map((el: number, index) => {
    return {
      id: el,
      treeType: trees[TREE_TYPE_BY_ID[index]],
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
  // Get entry points
  const entryPoints = getEntryPoints();
  // For each point, build a full path of 10 segments
  const paths = entryPoints.map((entryPoint) => buildPath(entryPoint));

  const shuffledPaths = utils.game.shuffle(paths);

  utils.players.getListOfPlayers(players).forEach((player, playerIndex) => {
    const path = shuffledPaths[playerIndex];
    player.map = utils.game.makeArray(PATH_DISTANCE).map((index) => {
      const point = path[index];
      const nextTree = getIndex(path[index + 1]);
      const treeId = getIndex(point);
      const segment: MapSegment = {
        index,
        playerId: player.id,
        treeId,
        passed: index === 0,
        score: 0,
        previousTree: index > 0 ? getIndex(path[index - 1]) : null,
        nextTree,
        direction: determineDirection(treeId, nextTree),
        clues: [],
        playersIds: [],
        active: false,
      };
      return segment;
    });
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
        (segment: MapSegment) => !segment.passed && segment.clues.length > 0
      );

      // Build an empty array of with the same length as the current map
      const correct: PlayerId[][] = currentMap.map(() => []);

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
      correct.forEach((tree: PlayerId[], index) => {
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
          lastIndex = index;
        }
        return lastIndex;
      },
      0
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

export const getAllCompletePlayerIds = (players: Players): PlayerId[] => {
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
    'adjectives'
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
