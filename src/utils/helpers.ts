import { USE_MOCKS } from 'dev-configs';
import { camelCase, orderBy, startCase } from 'lodash';
// Types
import type { GameInfo } from 'types/game-info';
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { AVATARS } from 'utils/avatars';
// Internal
import { SEPARATOR } from './constants';

/**
 * Creates a copy of given object
 * @param obj
 * @returns
 * @deprecated use lodash cloneDeep instead
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
export const isDevEnv: boolean = import.meta.env.MODE === 'development';
export const isDevMocking = isDevEnv && USE_MOCKS;
// export const isDevEnv = false;

const methods = {
  count: console.count.bind(console),
  log: console.log.bind(console),
  table: console.table.bind(console),
  warn: console.warn.bind(console),
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
 * Retrieves an array of GamePlayer objects based on an array of player IDs.
 * @param playerIds - An array of player IDs to look up.
 * @param players - An object containing all players, indexed by their IDs.
 * @returns An array of GamePlayer objects corresponding to the provided player IDs.
 */
export const getPlayersFromIds = (playerIds: PlayerId[], players: GamePlayers): GamePlayer[] => {
  return playerIds.map((playerId) => players[playerId]);
};

/**
 * Retrieves the names of players based on their IDs.
 * @param playerIds - An array of player IDs.
 * @param players - An object containing player information, where the key is the player ID and the value is the player details.
 * @returns An array of player names corresponding to the provided player IDs.
 */
export const getPlayerNamesFromIds = (playerIds: PlayerId[], players: GamePlayers): string[] => {
  return playerIds.map((playerId) => players[playerId].name);
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
export const shuffle = <T>(list: T[]): T[] => {
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
 * @param arr - An array to check for duplicates.
 * @returns True if duplicates exist, false otherwise.
 */
export const hasDuplicates = (arr: unknown[]): boolean => {
  return new Set(arr).size !== arr.length;
};

/**
 * Converts a string from kebab case to pascal case
 * @param str - The string to convert.
 * @returns The converted string in pascal case.
 */
export const kebabToPascal = (str: string): string => startCase(camelCase(str)).replace(/ /g, '');

/**
 * Gets avatar color by it
 * @param avatarId - The ID of the avatar.
 * @returns The color of the avatar or 'grey' if not found.
 */
export const getAvatarColorById = (avatarId: string): string => AVATARS?.[avatarId]?.color ?? 'grey';

/**
 * Converts a hex color string to an RGB array.
 * @param hex - The hex color string (e.g., "#FF5733").
 * @returns An array containing the RGB values [r, g, b].
 */
function hexToRgb(hex: string): [number, number, number] {
  // Remove the hash at the start if it's there
  const sanitizedHex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  const r = Number.parseInt(sanitizedHex.substring(0, 2), 16);
  const g = Number.parseInt(sanitizedHex.substring(2, 4), 16);
  const b = Number.parseInt(sanitizedHex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * Calculate the luminance of a color.
 * @param r - Red component (0-255).
 * @param g - Green component (0-255).
 * @param b - Blue component (0-255).
 * @returns The luminance value (0-1).
 */
function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    const normalizedV = v / 255;
    return normalizedV <= 0.03928 ? normalizedV / 12.92 : ((normalizedV + 0.055) / 1.055) ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Determines the contrast color based on the provided hex color.
 * @param hexColor - The hex color string to evaluate.
 * @returns 'white' or 'black' based on the luminance of the color.
 */
export const getContrastColor = (hexColor: string): 'white' | 'black' => {
  const [r, g, b] = hexToRgb(hexColor);
  const lum = luminance(r, g, b);

  // Using a contrast threshold of 0.179 (equivalent to luminance 0.5 for black/white)
  return lum > 0.045 ? 'white' : 'black';
};

/**
 * Animation types
 * For examples check: https://animate.style/
 */
export type AnimationType =
  | 'backInDown'
  | 'backInLeft'
  | 'backInRight'
  | 'backInUp'
  | 'backOutDown'
  | 'backOutLeft'
  | 'backOutRight'
  | 'backOutUp'
  | 'bounce'
  | 'bounceIn'
  | 'bounceInDown'
  | 'bounceInLeft'
  | 'bounceInRight'
  | 'bounceInUp'
  | 'bounceOut'
  | 'bounceOutDown'
  | 'bounceOutLeft'
  | 'bounceOutRight'
  | 'bounceOutUp'
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInDownBig'
  | 'fadeInLeft'
  | 'fadeInLeftBig'
  | 'fadeInRight'
  | 'fadeInRightBig'
  | 'fadeInUp'
  | 'fadeInUpBig'
  | 'fadeInTopLeft'
  | 'fadeInTopRight'
  | 'fadeInBottomLeft'
  | 'fadeInBottomRight'
  | 'fadeOut'
  | 'fadeOutDown'
  | 'fadeOutDownBig'
  | 'fadeOutLeft'
  | 'fadeOutLeftBig'
  | 'fadeOutRight'
  | 'fadeOutRightBig'
  | 'fadeOutUp'
  | 'fadeOutUpBig'
  | 'fadeOutTopLeft'
  | 'fadeOutTopRight'
  | 'fadeOutBottomLeft'
  | 'fadeOutBottomRight'
  | 'flash'
  | 'flip'
  | 'flipInX'
  | 'flipInY'
  | 'flipOutX'
  | 'flipOutY'
  | 'heartBeat'
  | 'headShake'
  | 'hinge'
  | 'jackInTheBox'
  | 'jello'
  | 'lightSpeedInLeft'
  | 'lightSpeedInRight'
  | 'lightSpeedOutLeft'
  | 'lightSpeedOutRight'
  | 'pulse'
  | 'rollIn'
  | 'rollOut'
  | 'rotateIn'
  | 'rotateInDownLeft'
  | 'rotateInDownRight'
  | 'rotateInUpLeft'
  | 'rotateInUpRight'
  | 'rotateOut'
  | 'rotateOutDownLeft'
  | 'rotateOutDownRight'
  | 'rotateOutUpLeft'
  | 'rotateOutUpRight'
  | 'rubberBand'
  | 'shakeX'
  | 'shakeY'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideOutDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'swing'
  | 'tada'
  | 'wobble'
  | 'zoomIn'
  | 'zoomInDown'
  | 'zoomInLeft'
  | 'zoomInRight'
  | 'zoomInUp'
  | 'zoomOut'
  | 'zoomOutDown'
  | 'zoomOutLeft'
  | 'zoomOutRight'
  | 'zoomOutUp';

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
  },
) => {
  const result = ['animate__animated', `animate__${type}`];

  if (options?.delay) {
    result.push(`animate__delay-${options?.delay}s`);
  }

  if (options?.speed) {
    result.push(`animate__${options?.speed}`);
  }

  if (options?.infinite) {
    result.push('animate__infinite');
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
export const sortPlayers = (players: GamePlayers, by = ['name'], orders: ('asc' | 'desc')[] = ['asc']) =>
  orderBy(Object.values(players), by, orders);

/**
 * Verify if all players are ready
 * @param players
 * @returns
 */
export const isEverybodyReady = (players: GamePlayers): boolean => {
  return Object.values(players).every((player) => player.ready);
};

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
    ideal: Math.max(Math.ceil(idealTime / 5) * 5, minTime),
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
  minDuration = 5,
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

/**
 * Remove accents from a string keeping original letters
 * @param str - The string to remove accents from.
 * @returns The string without accents.
 */
export function stringRemoveAccents(str: string): string {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: IDK why this is being flagged
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
