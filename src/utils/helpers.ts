import { camelCase, startCase } from 'lodash';
import { AVATARS } from 'utils/avatars';
import { SEPARATOR } from './constants';

/**
 * Creates a copy of given object
 * @param obj
 * @returns
 */
export const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj));

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
  players: Players,
  justNames = false
): (Player | PlayerName)[] => {
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
export const pluralize = (quantity: number, singular: string, plural: string): string => {
  if (!plural) return singular;
  return quantity === 1 ? singular : plural;
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
 * @param type
 * @returns
 */
export const getAnimationClass = (
  type: AnimationType,
  delayInSeconds?: number,
  speed?: 'slow' | 'slower' | 'fast' | 'faster',
  infinite?: boolean,
  repeat?: 1 | 2 | 3
) => {
  const result = ['animate__animated', `animate__${type}`];

  if (delayInSeconds) {
    result.push(`animate__delay-${delayInSeconds}s`);
  }

  if (speed) {
    result.push(`animate__${speed}`);
  }

  if (infinite) {
    result.push(`animate__infinite`);
  } else if (repeat) {
    result.push(`animate__repeat-${repeat}`);
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
