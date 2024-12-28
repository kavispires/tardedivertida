import { LETTERS, LETTERS_EN, LETTERS_PT } from './constants';
import { isEmulatingEnvironment } from './firebase';
import { getListOfPlayers } from './players-utils';

/**
 * Prints content to console if emulating environment
 */
export const print = (content: any) => {
  if (isEmulatingEnvironment()) {
    console.log(JSON.stringify(content, null, 2));
  }
};

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (
  gameCode: GameCode,
  language: Language,
  usedIds: string[] = [],
  length = 4,
): string => {
  if (!gameCode) throw Error('Missing game code');

  if (gameCode.length > 1 || !LETTERS.includes(gameCode)) throw Error('Invalid game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: GameCode, length: number, language: Language): string {
    let id = `${gameCode}`;
    // Add second character based on language
    id +=
      language === 'en'
        ? LETTERS_EN[Math.floor(Math.random() * LETTERS_EN.length)]
        : LETTERS_PT[Math.floor(Math.random() * LETTERS_PT.length)];

    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || usedIds.includes(gameId)) {
    gameId = generateId(gameCode, length, language);
  }

  return gameId;
};

/**
 * Remove accents from a string keeping original letters
 * @param str
 * @returns
 */
export function stringRemoveAccents(str: string): string {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Builds default initial state to be extended by game engines
 * @param dataObject
 * @returns
 */
export function getDefaultInitialState<T = InitialState>({
  gameId,
  gameName,
  uid,
  language,
  version,
  playerCounts,
  initialPhase,
  totalRounds,
  store,
  options = {},
  onCreate = () => ({}),
}: InitialStateArgs): InitialState | T {
  const createdAt = Date.now();
  const preSetupResult = onCreate();
  return {
    meta: {
      gameId,
      gameName,
      createdAt,
      createdBy: uid,
      min: playerCounts.MIN,
      max: playerCounts.MAX,
      isLocked: false,
      isComplete: false,
      language,
      replay: 0,
      options,
      version,
      ...(preSetupResult?.meta ?? {}),
    },
    store: {
      language,
      options,
      createdAt,
      ...store,
      ...(preSetupResult?.store ?? {}),
    },
    state: {
      phase: initialPhase,
      round: {
        current: 0,
        total: totalRounds,
        forceLastRound: false,
      },
      updatedAt: Date.now(),
      ...(preSetupResult?.state ?? {}),
      players: {
        ...(preSetupResult?.players ?? {}),
      },
    },
  };
}

/**
 * Calculates how many points remain to call the end of the game
 * @param players
 * @param victory
 * @returns
 */
export const getPointsToVictory = (players: Players, victory: number): number => {
  const max = getListOfPlayers(players, true).reduce((acc, player) => {
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
 * @deprecated use lodash orderBy
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
    ...round,
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
export const devSimulateWait = async (duration = 3000) => {
  if (isEmulatingEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};

export const forceWait = async (duration = 0) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
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
 * Builds BooleanDictionary from list of strings
 * @param list
 * @returns
 */
export const buildBooleanDictionary = (list: string[]): BooleanDictionary => {
  return list.reduce((acc, entry) => {
    acc[entry] = true;
    return acc;
  }, {});
};

/**
 * Creates a copy of given object
 * @param obj
 * @returns
 */
export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * Generates dictionary of given list of objects
 * @param list
 * @param keyProperty the property that will be the key of the dictionary
 * @returns
 */
export const buildDictionaryFromList = <T>(list: T[], keyProperty = 'id'): Record<string, T> =>
  list.reduce((acc: Record<string, T>, item: T) => {
    const key = (item as PlainObject)[keyProperty];
    acc[key] = item;
    return acc;
  }, {});
