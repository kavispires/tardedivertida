// Types
import { Tree } from './types';
// Constants
import {
  CARDS_PER_PLAYER,
  CARDS_PER_ROUND,
  DIRECTIONS,
  FOREST_ENTRY_POINTS,
  FOREST_SIZE,
  LABIRINTO_SECRETO_PHASES,
  PATH_DISTANCE,
  TREE_TYPE_BY_ID,
} from './constants';
// Utils
import utils from '../../utils';

export const determineGameOver = (...args: any) => {
  console.log(args);
  return false;
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
    return turnOrder?.at(-1) === activePlayerId ? RESULTS : PATH_FOLLOWING;
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
/**
 * Builds forest
 * @param cards
 * @returns
 */
export const buildForest = (cards: TextCard[]): Tree[] => {
  const trees = Array(5)
    .fill(0)
    .map(() => utils.game.getRandomNumber(1, 15));

  return utils.game.makeArray(FOREST_SIZE, 0).map((el: number, index) => {
    return {
      id: el + index,
      treeType: trees[TREE_TYPE_BY_ID[index]],
      card: cards[index],
    };
  });
};

function generateRandomPath(distance: number, entryPoint?: number): number[] {
  const gridWidth = 7;
  const gridHeight = 5;

  const directions = [-gridWidth, 1, gridWidth, -1]; // Up, Right, Down, Left

  const path: number[] = [];

  const getRandomDirection = (cell: number): number => {
    const possibleDirections: number[] = [];
    for (const direction of directions) {
      const neighborCell = cell + direction;
      if (neighborCell >= 0 && neighborCell < gridWidth * gridHeight && !path.includes(neighborCell)) {
        possibleDirections.push(direction);
      }
    }
    if (possibleDirections.length === 0) return 0;
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  };

  let currentCell = entryPoint ?? FOREST_ENTRY_POINTS[Math.floor(Math.random() * FOREST_ENTRY_POINTS.length)];
  path.push(currentCell);

  while (path.length < distance) {
    const direction = getRandomDirection(currentCell);
    if (direction === null) break;
    currentCell += direction;
    path.push(currentCell);
  }

  return path;
}

export const buildPaths = (players: Players) => {
  const allPaths = utils.game
    .shuffle(FOREST_ENTRY_POINTS)
    .map((entryPoint) => generateRandomPath(PATH_DISTANCE, entryPoint));

  utils.players.getListOfPlayers(players).forEach((player, playerIndex) => {
    const path = allPaths[playerIndex];
    player.map = utils.game.makeArray(PATH_DISTANCE).map((index) => {
      const treeId = path[index];
      const nextTree = index < PATH_DISTANCE - 1 ? path[index + 1] : null;
      return {
        index,
        playerId: player.id,
        treeId,
        past: false,
        score: 0,
        previousTree: index > 0 ? path[index - 1] : null,
        nextTree,
        direction: determineDirection(treeId, nextTree),
      };
    });
  });
};

const determineDirection = (currentTree: number, nextTree: number | null) => {
  if (!nextTree) return null;
  if (nextTree - currentTree === 1) return DIRECTIONS.RIGHT;
  if (nextTree - currentTree > 1) return DIRECTIONS.DOWN;
  if (nextTree - currentTree === -1) return DIRECTIONS.LEFT;
  if (nextTree - currentTree < -1) return DIRECTIONS.UP;
  return null;
};

export const distributeCards = (store: PlainObject, players: Players, cards: TextCard[]) => {
  // Builds a 18 card deck per player
  utils.deck.setup(store, players, cards, CARDS_PER_PLAYER);
  // Deals the first 3 cards
  utils.deck.deal(store, players, CARDS_PER_ROUND);
};
