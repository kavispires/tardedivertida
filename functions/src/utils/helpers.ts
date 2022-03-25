import { LETTERS } from './constants';
import {
  BooleanDictionary,
  GameCode,
  InitialState,
  InitialStateArgs,
  NewScores,
  PlainObject,
  PlayerId,
  Players,
  Round,
  Teams,
} from './types';
import { shuffle } from './game-utils';

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (gameCode: GameCode, usedIds: string[] = [], length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  if (gameCode.length > 1 || !LETTERS.includes(gameCode)) throw Error('Invalid game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: GameCode, length: number): string {
    let id = `${gameCode}`;
    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || usedIds.includes(gameId)) {
    gameId = generateId(gameCode, length);
  }

  return gameId;
};

/**
 * Remove accents from a string keeping original letters
 * @param str
 * @returns
 */
export function stringRemoveAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Builds default initial state to be extended by game engines
 * @param dataObject
 * @returns
 */
export function getDefaultInitialState({
  gameId,
  gameName,
  uid,
  language,
  playerCounts,
  initialPhase,
  totalRounds,
  store,
  options = {},
}: InitialStateArgs): InitialState {
  return {
    meta: {
      gameId,
      gameName: gameName,
      createdAt: Date.now(),
      createdBy: uid,
      min: playerCounts.MIN,
      max: playerCounts.MAX,
      isLocked: false,
      isComplete: false,
      language,
      replay: 0,
      options,
    },
    players: {},
    store: {
      language,
      options,
      ...store,
    },
    state: {
      phase: initialPhase,
      round: {
        current: 0,
        total: totalRounds,
      },
      updatedAt: Date.now(),
    },
  };
}

/**
 * Calculates how many points remain to call the end of the game
 * @param players
 * @param victory
 * @returns
 */
export const getPointsToVictory = (players: Players | Teams, victory: number): number => {
  const max = Object.values(players).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);
  return max < victory ? victory - max : 0;
};

/**
 * Calculates how many rounds remain to call the end of the game
 * @param currentRound
 * @param totalRounds
 * @returns
 */
export const getRoundsToEndGame = (currentRound: number, totalRounds: number): number => {
  return totalRounds - currentRound;
};

/**
 * Orders array by a value its item object
 * @param {object[]} list
 * @param {string|string[]} properties
 * @param {string|string[]} orders
 * @returns {object[]}
 */
export const orderBy = <T>(list: T[], properties: string | string[], orders: string | string[]): T[] => {
  function sortBy(_key: string, _cb: any) {
    if (!_cb) _cb = () => 0;
    return (a: any, b: any) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : _cb(a, b));
  }

  function sortByDesc(key: string, _cb: any) {
    if (!_cb) _cb = () => 0;
    return (b, a) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : _cb(b, a));
  }

  let cb: any = () => 0;
  const p = Array.isArray(properties) ? properties.reverse() : [properties];
  const o = Array.isArray(orders) ? orders.reverse() : [orders];

  for (const [i, key] of p.entries()) {
    const order = o[i] ?? o[0] ?? 'asc';
    if (order === 'asc') {
      cb = sortBy(key, cb);
    } else if (order === 'desc') {
      cb = sortByDesc(key, cb);
    } else {
      throw new Error(`Unsupported order "${order}"`);
    }
  }

  return [...list].sort(cb);
};

/**
 * Increase the current round count by 1
 * @param round
 * @param [total] overrides total
 * @param [current] overrides current (there won't be a increase)
 * @returns
 */
export const increaseRound = (round: Round, total?: number, current?: number): Round => {
  return {
    total: total ?? round.total,
    current: current ?? (round?.current ?? 0) + 1,
  };
};

/**
 * Flattens a two dimensional array
 * @param twoDimensionalArray
 * @returns
 */
export const flattenArray = <T>(twoDimensionalArray: T[][]): T[] =>
  twoDimensionalArray.reduce((acc, arr) => [...acc, ...arr], []);

/**
 * Function to simulate calls when developing
 * @param duration
 */
export const wait = async (duration = 3000) => {
  if (process.env.FUNCTIONS_EMULATOR) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};

/**
 * Creates a dictionary with used card ids
 * @param dataList
 * @returns
 */
export const buildIdDictionary = (dataList: PlainObject[]): BooleanDictionary => {
  return dataList.reduce((acc, entry) => {
    acc[entry.id] = true;
    return acc;
  }, {});
};

/**
 * Builds new scoring object used by ranking builders
 * @param players
 * @param gainedPointsInitialState
 * @returns
 */
export const buildNewScoreObject = (players: Players, gainedPointsInitialState?: number[]): NewScores => {
  const newScores: NewScores = {};

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = {
      playerId: player.id,
      name: player.name,
      previousScore: player.score,
      gainedPoints: gainedPointsInitialState ? [...gainedPointsInitialState] : new Array(1).fill(0),
      newScore: player.score,
    };
  });

  return newScores;
};

/**
 * Randomizes player ids
 * @param players
 * @param doublingThreshold - doubles the order player count is lower than this
 * @returns
 */
export const buildGameOrder = (
  players: Players,
  doublingThreshold = 0
): { gameOrder: PlayerId[]; playerIds: PlayerId[]; playerCount: number } => {
  const playerIds = shuffle(Object.keys(players));
  const gameOrder = playerIds.length < doublingThreshold ? [...playerIds, ...playerIds] : playerIds;
  return { gameOrder, playerIds, playerCount: playerIds.length };
};
