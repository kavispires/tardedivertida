import { sampleSize } from 'lodash';
import { LETTERS, LETTERS_EN, LETTERS_PT } from './constants';
import { buildBooleanDictionary } from './helpers';
import { getListOfPlayers } from './players-utils';

/**
 * Game-specific utility functions for game mechanics and flow.
 *
 * This file contains utilities specifically related to game logic including:
 * - Game flow (phase delegation, game ID generation, initial state setup)
 * - Game state (victory points, rounds management)
 * - Game-specific randomization (filtering by used items, dealing cards/tokens)
 * - Game data operations (filtering by IDs)
 *
 * For generic, reusable utilities not specific to game logic,
 * see helpers.ts instead.
 */

// Game Flow

/**
 * Determines the next phase in the game flow based on the current phase.
 * If the current phase is not found in the ordered list, defaults to the first phase.
 * Special handling for 'LOBBY' phase which always advances to the first game phase.
 * @param currentPhase - The current phase of the game
 * @param orderedPhases - Array of phases in sequential order
 * @returns The next phase in the sequence
 */
export const nextPhaseDelegator = (currentPhase: string, orderedPhases: string[]): string => {
  const currentPhaseIndex = orderedPhases.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return orderedPhases[currentPhaseIndex + 1];
  }

  if (currentPhase === 'LOBBY') {
    return orderedPhases[0];
  }

  // biome-ignore lint/suspicious/noConsole: on purpose
  console.warn(`⚠️ Missing phase check to follow ${currentPhase}`);
  return orderedPhases[0];
};

/**
 * Generates a unique game ID with the specified game code prefix and language identifier.
 * Format: [gameCode][languageLetter][randomLetters]
 * Example: 'ABCD' where A is game code, B is language letter, CD are random
 * @param gameCode - A single capital letter identifying the game
 * @param language - The game language ('en' or 'pt')
 * @param usedIds - Array of already-used IDs to avoid duplicates
 * @param length - The total length of the game ID
 * @returns A unique game ID string
 */
export const generateGameId = (
  gameCode: UID,
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
  function generateId(gameCode: UID, length: number, language: Language): string {
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
 * Builds the default initial state structure for a game.
 * This provides the foundational meta, store, and state objects that all games extend.
 * @param params - Object containing game initialization parameters
 * @returns The complete initial state object for the game
 */
export function getDefaultInitialState<T = InitialState>({
  gameId,
  gameName,
  uid,
  language,
  version,
  playerCounts,
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
      phase: 'LOBBY',
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

// Game Scoring & Rounds

/**
 * Calculates how many points the leading player needs to reach the victory threshold.
 * Returns 0 if a player has already reached or exceeded the victory points.
 * @param players - The players object containing all player data
 * @param victory - The number of points needed to win
 * @returns The number of points remaining until victory
 */
export const getPointsToVictory = (players: Players, victory: number): number => {
  const max = getListOfPlayers(players, true).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);
  return max < victory ? victory - max : 0;
};

/**
 * Calculates how many rounds remain until the game ends.
 * @param currentRound - The current round number
 * @param totalRounds - The total number of rounds in the game
 * @returns The number of rounds remaining
 */
export const getRoundsToEndGame = (currentRound: number, totalRounds: number): number => {
  return totalRounds - currentRound;
};

/**
 * Increments the current round count by 1.
 * Optionally allows overriding the total or setting a specific current round.
 * @param round - The current round object
 * @param total - Optional override for total rounds
 * @param current - Optional override for current round (prevents increment)
 * @returns Updated round object with incremented current value
 */
export const increaseRound = (round: Round, total?: number, current?: number): Round => {
  return {
    ...round,
    total: total ?? round.total,
    current: current ?? (round?.current ?? 0) + 1,
  };
};

// Game-Specific Randomization

/**
 * Selects random items from an array, excluding items that have already been used.
 * Game-specific utility for managing used/available item pools.
 * @param list - The array to select from
 * @param used - Array of items to exclude from selection
 * @param quantity - The number of items to select
 * @returns An array of randomly selected unique items
 */
export const getRandomUniqueItems = <T>(list: T[], used: T[] = [], quantity = 1): T[] => {
  const availableList = list.filter((i) => !used.includes(i));
  return sampleSize(availableList, quantity);
};

/**
 * Selects a single random item from an array, excluding already-used items.
 * @param list - The array to select from
 * @param used - Array of items to exclude from selection
 * @returns A randomly selected unique item
 */
export const getRandomUniqueItem = <T>(list: T[], used: T[]): T => {
  return getRandomUniqueItems(list, used, 1)[0];
};

/**
 * Selects random unique objects from an array, filtering by a property to avoid duplicates.
 * Useful for selecting game items like cards or tokens by their ID.
 * @param list - The array of objects to select from
 * @param used - Array of already-used objects
 * @param quantity - The number of objects to select
 * @param byPropertyName - The property name to use for uniqueness checking
 * @returns An array of randomly selected unique objects
 */
export const getRandomUniqueObjects = <T>(
  list: T[],
  used: T[],
  quantity: number,
  byPropertyName = 'id',
): T[] => {
  const usedIdDict = buildBooleanDictionary(used as PlainObject[]);
  const availableList = list.filter((entry) => !usedIdDict[entry[byPropertyName]]);
  return sampleSize(availableList, quantity);
};

// Game Data Operations

/**
 * Deals items from the end of an array, removing them from the original array.
 * WARNING: This modifies the original array by popping items.
 * Game-specific utility for dealing cards/tokens during gameplay.
 * @param list - The array to deal from (will be modified)
 * @param quantity - The number of items to deal
 * @returns An array of dealt items
 */
export const dealItems = <T>(list: T[], quantity: number) => {
  const dealt: T[] = [];
  for (let i = 0; i < quantity; i++) {
    const item = list.pop();
    if (item) {
      dealt.push(item);
    }
  }
  return dealt;
};

/**
 * Filters a dictionary to exclude entries with IDs present in the usedIds set.
 * Useful for removing already-used game resources from an available pool.
 * @param dict - The dictionary to filter
 * @param usedIds - A boolean dictionary of IDs to exclude
 * @returns A new dictionary with used IDs removed
 */
export const filterOutByIds = <T>(
  dict: Record<string, T>,
  usedIds: Dictionary<boolean>,
): Record<string, T> => {
  return Object.keys(dict).reduce((acc: Record<string, T>, entryId: string) => {
    if (!usedIds[entryId]) {
      acc[entryId] = dict[entryId];
    }

    return acc;
  }, {});
};
