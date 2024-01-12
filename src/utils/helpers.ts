import { camelCase, memoize, orderBy, startCase } from 'lodash';
// Types
import type { GameInfo } from 'types/game-info';
// Utils
import { AVATARS } from 'utils/avatars';
import { SEPARATOR } from './constants';

/**
 * Creates a copy of given object
 * @param obj
 * @returns
 */
export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * Extract the gameId from react history
 * @param pathname
 * @returns
 */
export const getGameIdFromPathname = (pathname: string): string => {
  return pathname.substring(1);
};

/**
 * Extract the gameId from react history.location
 * @param location
 * @returns
 */
export const getGameIdFromLocation = (location?: PlainObject): string => {
  const { pathname = '/' } = location ?? {};
  return pathname.substring(1);
};

/**
 * Get random element/item from a list
 * @param list
 * @returns one random item
 */
export const getRandomItem = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Gets the last item in a list
 * @param list
 * @returns
 */
export const getLastItem = <T>(list: T[]): T => {
  return list[list.length - 1];
};

/**
 * Get date from now within the given seconds
 * @param seconds
 * @returns
 */
export const inNSeconds = (seconds: number): Date => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

/**
 * Same as inNSeconds but not just seconds
 * @param time
 * @returns
 */
export const inNTime = (time: number): Date => {
  const date = new Date();
  date.setTime(date.getTime() + time);
  return date;
};

/**
 * Flag indicating if the environment is for development
 */
export const isDevEnv: boolean = process.env.NODE_ENV === 'development';
// export const isDevEnv = false;

const methods = {
  count: console.count,
  log: console.log,
  table: console.table,
  warn: console.warn,
};

/**
 * Prints a message to the console using a specified console method if in development environment.
 * @param message - The message to be printed to the console.
 * @param [method='log'] - The console method to use for printing (one of: 'count', 'log', 'table', 'warn').
 */
export const print = (message: any, method: keyof typeof methods = 'log') => {
  if (isDevEnv) {
    methods[method](message);
  }
};

/**
 * Verify if the game id exists and has the correct length
 * @param gameId
 * @returns
 */
export const isValidGameId = (gameId: GameId): boolean => {
  return Boolean(gameId) && gameId.length === 4;
};

/**
 * Gets color name from index
 * @param index
 * @returns
 */
export const getColorFromIndex = (index: number): string => {
  return (
    [
      'red',
      'blue',
      'green',
      'yellow',
      'pink',
      'purple',
      'teal',
      'orange',
      'coffee',
      'navy',
      'light-green',
      'brown',
      'hot-pink',
      'violet',
      'forest',
      'cream',
    ][index] ?? 'none'
  );
};

/**
 * Get color name from letter
 * @param letter
 * @returns
 */
export const getColorFromLetter = (letter: string): string => {
  return (
    {
      A: 'red',
      B: 'blue',
      C: 'green',
      D: 'yellow',
      E: 'pink',
      F: 'purple',
      G: 'teal',
      H: 'orange',
      I: 'coffee',
      J: 'navy',
      K: 'light-green',
      L: 'brown',
      M: 'hot-pink',
      N: 'violet',
      O: 'forest',
      P: 'cream',

      // repeats
      Q: 'red',
      R: 'blue',
      S: 'green',
      T: 'yellow',
      U: 'pink',
      V: 'purple',
      W: 'teal',
      X: 'none',
      Y: 'orange',
      Z: 'coffee',
    }[letter] ?? 'none'
  );
};

/**
 * Get given players from list of ids
 * @param  playerIds
 * @param players
 * @param justNames if true, only return names
 * @returns
 */
export const getPlayersFromIds = (
  playerIds: PlayerId[],
  players: GamePlayers,
  justNames = false
): (GamePlayer | PlayerName)[] => {
  return playerIds.map((playerId) => {
    const player = players[playerId];
    if (justNames) return player.name;
    return player;
  });
};

/**
 * Determines if it should output the singular or plural argument depending on given quantity
 * @param quantity
 * @param singular
 * @param plural
 * @returns
 */
export const pluralize = (quantity: number, singular: string, plural?: string): string => {
  return quantity === 1 ? singular : plural ? plural : `${singular}s`;
};

/**
 * Shuffle list copy
 * @param {any[]} list
 * @returns
 */
export const shuffle = (list: any[]): any[] => {
  const result = [...list];
  result.sort(() => Math.random() - 0.5);
  return result;
};

/**
 * Builds entry id from array elements separated by the separator
 * @param arr
 * @returns
 */
export const getEntryId = (arr: string[]): string => arr.join(SEPARATOR);

/**
 * Parses entry id into its different parts by a separator
 * @param key
 * @returns
 */
export const parseEntryId = (key: string): string[] => key.split(SEPARATOR);

/**
 * Check if array has duplicates
 * @param arr
 * @returns
 */
export const hasDuplicates = (arr: any): boolean => {
  return new Set(arr).size !== arr.length;
};

/**
 * Converts a string from kebab case to pascal base
 * @param str
 * @returns
 */
export const kebabToPascal = (str: string): string => startCase(camelCase(str)).replace(/ /g, '');

/**
 * Gets avatar color by it
 * @param avatarId
 * @returns
 */
export const getAvatarColorById = (avatarId: string) => AVATARS?.[avatarId]?.color ?? 'grey';

/**
 * Return the correct animation class from animate.css
 * @param type - animation type
 * @param options - animation options
 * @param options.delay - delay in seconds
 * @param options.speed - animation speed
 * @param options.infinite - infinite animation
 * @param options.repeat - animation repeat
 * @returns
 */
export const getAnimationClass = (
  type: AnimationType,
  options?: {
    /**
     * Delay (0-20) in 0.5 increments
     */
    delay?: number;
    speed?: 'slow' | 'slower' | 'fast' | 'faster';
    infinite?: boolean;
    repeat?: 1 | 2 | 3;
  }
) => {
  const result = ['animate__animated', `animate__${type}`];

  if (options?.delay) {
    result.push(`animate__delay-${options?.delay}s`);
  }

  if (options?.speed) {
    result.push(`animate__${options?.speed}`);
  }

  if (options?.infinite) {
    result.push(`animate__infinite`);
  } else if (options?.repeat) {
    result.push(`animate__repeat-${options?.repeat}`);
  }

  return result.join(' ');
};

/**
 * Convert a yyyy/mm/dd date to milliseconds
 * @param yyyymmdd
 * @returns
 */
export const convertYYYYMMDDtoMilliseconds = (yyyymmdd: string): number => {
  const dateArgs = yyyymmdd.match(/\d{2,4}/g);

  const year = Number(dateArgs?.[0] ?? '2022');
  const month = Number(dateArgs?.[1] ?? '1');
  const day = Number(dateArgs?.[2] ?? '1');

  return new Date(year, month, day).getTime();
};

export const truncateRecommended = (recommended: number[]): string => {
  let result = '';
  recommended.forEach((number, index) => {
    if (!result || result[result.length - 1] === ',') {
      result += number;
      return;
    }

    if (number - 1 === recommended[index - 1] && result[result.length - 1] !== '-') {
      result += '-';

      if (number + 1 !== recommended[index + 1]) {
        result += number;
      }

      return;
    }

    if (
      result[result.length - 1] === '-' &&
      number + 1 !== recommended[index + 1] &&
      result[result.length - 1] !== `${number}`
    ) {
      result += number;
      return;
    }

    if (number !== recommended[index - 1] + 1) {
      result += `,${number}`;
      return;
    }

    if (recommended.length - 1 === index) {
      result += number;
    }
  });

  return result;
};

/**
 * Sort players by name
 * @param players
 * @returns
 */
export const sortPlayers = memoize(
  (players: GamePlayers, by = ['name'], orders: ('asc' | 'desc')[] = ['asc']) =>
    orderBy(Object.values(players), by, orders)
);

/**
 * Calculate a game average duration
 * @param game
 * @param numPlayers
 * @returns
 */
export const calculateGameAverageDuration = (game: GameInfo, numPlayers = 0) => {
  const base = game?.duration?.base ?? 0;
  const perPlayer = game?.duration?.perPlayer ?? 0;

  const minTime = base + perPlayer * game.playerCount.min;
  const maxTime = base + perPlayer * game.playerCount.max;
  const idealTime = base + perPlayer * (game.playerCount.best ?? 0);
  const customTime = base + perPlayer * numPlayers;

  return {
    min: Math.ceil(minTime / 5) * 5,
    max: Math.ceil(maxTime / 5) * 5,
    ideal: Math.ceil(idealTime / 5) * 5,
    customTime: Math.ceil(customTime / 5) * 5,
  };
};

/**
 * Calculates a good duration to wait for something based on the number of players
 * @param numPlayers
 * @param durationPerPlayer
 * @param minDuration
 * @param maxDuration
 * @returns
 */
export const getMeanDuration = (
  numPlayers: number,
  durationPerPlayer: number,
  maxDuration = 30,
  minDuration = 5
) => {
  const duration = numPlayers * durationPerPlayer;

  return Math.min(maxDuration, Math.max(minDuration, duration));
};

/**
 * Creates array of given length filled with indexes
 * @param length the length of the array
 * @param startAt the starting value
 * @returns
 */
export const makeArray = (length = 1, startAt = 0): number[] =>
  new Array(length).fill(0).map((e, i) => e + i + startAt);

/**
 * Remove duplicated elements from a list
 * @param arr
 * @returns
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Formats a time value in seconds as a string in the format `mm:ss`.
 * @param {number} seconds - The time value in seconds.
 * @returns {string} A string representation of the time value in the format `mm:ss`.
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds}`;
};
