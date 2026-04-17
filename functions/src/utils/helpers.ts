/**
 * Generic utility functions for common operations.
 *
 * This file contains reusable, non-game-specific helper functions including:
 * - String manipulation (remove accents)
 * - Array operations (flatten, get last, remove items, make arrays, remove duplicates, unique items)
 * - Object utilities (merge, build dictionaries)
 * - Math calculations (average, longest run)
 * - Development tools (print, wait functions)
 *
 * For game-specific utilities like game flow, scoring, rounds, and randomization,
 * see game-utils.ts instead.
 */

import { isEmulatingEnvironment } from './firebase';
import { mean, shuffle } from 'lodash';

/**
 * Prints content to console in JSON format when running in emulation environment.
 * Used for debugging during local development.
 * @param content - The content to print to console
 */
export const print = (content: unknown) => {
  if (isEmulatingEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.log(JSON.stringify(content, null, 2));
  }
};

/**
 * Removes accents and diacritical marks from a string while keeping the base letters.
 * Example: "café" becomes "cafe"
 * @param str - The string to remove accents from
 * @returns The string without accents
 */
export function stringRemoveAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gets the last item in an array.
 * @deprecated Use lodash _.last instead
 * @param list - The array to get the last item from
 * @returns The last item in the array
 */
export const getLastItem = <T>(list: T[]): T => {
  return list[list.length - 1];
};

/**
 * Removes a specific item from an array and returns a new array without that item.
 * Does not mutate the original array.
 * @deprecated Use lodash _.without instead
 * @param list - The array to remove an item from
 * @param target - The item to remove
 * @returns A new array with the target item removed
 */
export const removeItem = (list: Primitive[], target: Primitive): Primitive[] => {
  return list.filter((item) => item !== target);
};

/**
 * Creates an array of sequential numbers with a specified length and starting point.
 * Example: makeArray(3, 5) returns [5, 6, 7]
 * @param length - The length of the array to create
 * @param startAt - The starting value for the sequence
 * @returns An array of sequential numbers
 */
export const makeArray = (length = 1, startAt = 0): number[] =>
  new Array(length).fill(0).map((e, i) => e + i + startAt);

/**
 * Removes duplicate elements from an array, keeping only unique values.
 * @deprecated Use lodash _.uniq instead
 * @param arr - The array to remove duplicates from
 * @returns A new array with only unique values
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Returns an array of unique items that are present in only one of arrays.
 * @deprecated Use lodash _.xor instead
 * @param array1 - The first array to compare.
 * @param array2 - The second array to compare.
 * @returns An array of unique items that are present in one of the arrays.
 */
export function getUniqueItems(array1: any[], array2: any[]): any[] {
  const counts: Dictionary<number> = {};

  // Add the items from the first array to the map
  array1.forEach((item) => {
    if (counts[item] === undefined) {
      counts[item] = 0;
    }
    counts[item] += 1;
  });

  // Add the unique items from the second array to the result
  array2.forEach((item) => {
    if (counts[item] === undefined) {
      counts[item] = 0;
    }
    counts[item] += 1;
  });

  return Object.entries(counts)
    .filter(([, count]) => count === 1)
    .map(([key]) => key);
}

/**
 * Merges the properties of multiple objects into one object.
 * @deprecated Use lodash _.merge instead
 * @param {object} target - The target object to merge the source objects into.
 * @param {...any} sources - The source objects to merge into the target object.
 * @returns {any} The target object with the properties of the source objects merged in.
 */
export function merge(target: any, ...sources: any[]): any {
  sources.forEach((source) => {
    for (const key in source) {
      if (source[key] !== null || source[key] !== undefined) {
        if (typeof target[key] === 'object' && typeof source[key] === 'object') {
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  });

  return target;
}

/**
 * Calculates the average (mean) of an array of numbers.
 * @param values - The array of numbers to average
 * @param round - Whether to round the result to the nearest integer
 * @returns The average value, optionally rounded
 */
export function calculateAverage(values: number[], round = false): number {
  if (!values || values.length === 0) {
    return 0;
  }

  const average = mean(values);

  if (round) {
    return Math.round(average);
  }

  return average;
}

/**
 * Calculates the longest consecutive streak of a specific value in an array.
 * Example: [1, 2, 2, 2, 1, 2, 2] with target 2 returns 3
 * @param values - The array to search for streaks
 * @param target - The value to count consecutive occurrences of
 * @returns The length of the longest streak
 */
export function calculateLongestRun(
  values: (string | number | boolean)[],
  target: string | number | boolean,
): number {
  let currentStreak = 0;
  let longestStreak = 0;

  values.forEach((v) => {
    if (v === target) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });

  return longestStreak;
}

/**
 * Builds a Dictionary<boolean> from a list of strings or objects with an 'id' property.
 * @param list - Array of strings or objects with 'id' property
 * @param key - Optional key to extract from objects (defaults to 'id')
 * @returns Dictionary<boolean>
 */
export const buildBooleanDictionary = <T>(list: T[], key = 'id'): Dictionary<boolean> => {
  return list.reduce((acc: Dictionary<boolean>, entry) => {
    const value = typeof entry === 'string' ? entry : entry[key];
    acc[value] = true;
    return acc;
  }, {});
};

/**
 * Simulates a delay during development when running in emulation environment.
 * Useful for testing loading states and async behavior.
 * @param duration - The delay duration in milliseconds
 */
export const devSimulateWait = async (duration = 3000) => {
  if (isEmulatingEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};

/**
 * Pauses execution for a specified duration.
 * Unlike devSimulateWait, this works in all environments.
 * @param duration - The duration to wait in milliseconds
 */
export const forceWait = async (duration = 0) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

// Random & Shuffling

/**
 * Generates a random integer within a specified range (inclusive).
 * @deprecated Use lodash _.random instead
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export const getRandomNumber = (min = 0, max = 100): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Selects a single random item from an array.
 * @deprecated Use lodash _.sample instead
 * @param list - The array to select from
 * @returns A randomly selected item from the array
 */
export const getRandomItem = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Selects multiple random items from an array without replacement.
 * If quantity exceeds array length, returns all items shuffled.
 * @deprecated Use lodash _.sampleSize instead
 * @param list - The array to select from
 * @param quantity - The number of items to select
 * @returns An array of randomly selected items
 */
export const getRandomItems = <T>(list: T[], quantity = 1): T[] => {
  const shuffledList = shuffle(list);
  if (quantity > shuffledList.length) return shuffledList;

  const res = new Array(quantity).fill(null);
  for (let i = 0; i < res.length; i++) {
    res[i] = shuffledList[i];
  }
  return res;
};

// Array Navigation

/**
 * Gets the next item in an array, with optional wrapping to the beginning.
 * Useful for circular sequences and iteration.
 * @param list - The array to traverse
 * @param currentItem - The current item to find the successor of
 * @param wrap - Whether to wrap around to the first item after the last
 * @returns The next item in the array, or null if at end without wrapping
 */
export const getNextItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.indexOf(currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === list.length - 1) {
    return wrap ? list[0] : null;
  }

  return list[currentIndex + 1];
};

/**
 * Gets the previous item in an array, with optional wrapping to the end.
 * Useful for reverse traversal in circular sequences.
 * @param list - The array to traverse
 * @param currentItem - The current item to find the predecessor of
 * @param wrap - Whether to wrap around to the last item before the first
 * @returns The previous item in the array, or null if at start without wrapping
 */
export const getPreviousItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.indexOf(currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === 0) {
    return wrap ? list[list.length - 1] : null;
  }

  return list[currentIndex - 1];
};

// Array Slicing

/**
 * Splits an array into chunks of a specified size.
 * The last chunk may be smaller if the array length is not evenly divisible.
 * @deprecated Use lodash _.chunk instead
 * @param list - The array to split
 * @param chunkSize - The size of each chunk
 * @returns A 2D array of chunks
 */
export const sliceIntoChunks = <T>(list: T[], chunkSize = 2): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

/**
 * Splits an array into a specified number of approximately equal parts.
 * Distributes items as evenly as possible when array length is not evenly divisible.
 * @param list - The array to split
 * @param numParts - The number of parts to split into
 * @returns A 2D array of parts
 */
export const sliceInParts = <T>(list: T[], numParts = 1): T[][] => {
  const res: T[][] = [];

  if (numParts === 1) return [list];
  if (numParts < 1) return [];

  let i = 0;

  if (list.length % numParts === 0) {
    const partSize = Math.floor(list.length / numParts);
    while (i < list.length) {
      const end = i + partSize;
      res.push(list.slice(i, end));
      i = end;
    }
  } else {
    while (i < list.length) {
      const partSize = Math.ceil((list.length - i) / numParts--);
      const end = i + partSize;
      res.push(list.slice(i, end));
      i = end;
    }
  }

  return res;
};
