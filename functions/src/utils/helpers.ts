import { LETTERS, LETTERS_EN, LETTERS_PT } from './constants';
import { isEmulatingEnvironment } from './firebase';
import { getListOfPlayers } from './players-utils';

/**
 * Prints content to console if emulating environment
 */
export const print = (content: unknown) => {
  if (isEmulatingEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.log(JSON.stringify(content, null, 2));
  }
};

export const warnMissingPhase = (phase: string) => {
  // biome-ignore lint/suspicious/noConsole: on purpose
  console.warn(`Missing phase check to follow ${phase}`);
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
 */
export const flattenArray = <T>(twoDimensionalArray: T[][]): T[] =>
  twoDimensionalArray.reduce((acc, arr) => acc.concat(arr), []);

/**
 * Function to simulate calls when developing
 */
export const devSimulateWait = async (duration = 3000) => {
  if (isEmulatingEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};

/**
 * Pauses the execution for a specified duration.
 * @param [duration=0] - The duration to wait in milliseconds. Defaults to 0 if not provided.
 * @returns A promise that resolves after the specified duration.
 */
export const forceWait = async (duration = 0) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

/**
 * Builds a BooleanDictionary from a list of strings or objects with an 'id' property.
 * @param list - Array of strings or objects with 'id' property
 * @param key - Optional key to extract from objects (defaults to 'id')
 * @returns BooleanDictionary
 */
export const buildBooleanDictionary = <T>(list: T[], key = 'id'): BooleanDictionary => {
  return list.reduce((acc: BooleanDictionary, entry) => {
    const value = typeof entry === 'string' ? entry : entry[key];
    acc[value] = true;
    return acc;
  }, {});
};

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
