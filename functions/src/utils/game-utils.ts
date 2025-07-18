import { buildBooleanDictionary } from './helpers';

// Shuffling

/**
 * Shuffle list copy
 * @param list
 * @returns
 */
export const shuffle = <T>(list: T[]): T[] => {
  const result = [...list];
  result.sort(() => Math.random() - 0.5);
  return result;
};

// Random

/**
 * Get random number
 * @param [min] inclusive
 * @param [max] inclusive
 * @returns a random number
 */
export const getRandomNumber = (min = 0, max = 100): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Get random element/item from a list
 * @param list
 * @returns one random item
 */
export const getRandomItem = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Get random elements from a list
 * @param list
 * @param [quantity]
 * @returns random items
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

/**
 * Get random unique items from a list
 * @param list
 * @param used
 * @param [quantity]
 * @returns
 */
export const getRandomUniqueItems = <T>(list: T[], used: T[] = [], quantity = 1): T[] => {
  const availableList = list.filter((i) => !used.includes(i));
  return getRandomItems(availableList, quantity);
};

/**
 * Get a random item from list that is not
 * @param list
 * @param used
 * @returns
 */
export const getRandomUniqueItem = <T>(list: T[], used: T[]): T => {
  return getRandomUniqueItems(list, used, 1)[0];
};

/**
 * Get random unique items from a list of objects
 * @param list
 * @param used
 * @param quantity
 * @param byPropertyName property name
 * @returns
 */
export const getRandomUniqueObjects = <T>(
  list: T[],
  used: T[],
  quantity: number,
  byPropertyName = 'id',
): T[] => {
  const usedIdDict = buildBooleanDictionary(used as PlainObject[]);
  const availableList = list.filter((entry) => !usedIdDict[entry[byPropertyName]]);
  return getRandomItems(availableList, quantity);
};

/**
 * Gets the next item in a array
 * @param list
 * @param currentItem
 * @param wrap determine if the result should wrap to the beginning of the array
 * @returns
 */
export const getNextItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.findIndex((i) => i === currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === list.length - 1) {
    return wrap ? list[0] : null;
  }

  return list[currentIndex + 1];
};

/**
 * Gets the previous item in a array
 * @param list
 * @param currentItem
 * @param wrap determine if the result should wrap to the end of the array
 * @returns
 */
export const getPreviousItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.findIndex((i) => i === currentItem);

  if (currentItem === -1) return null;

  if (currentIndex === 0) {
    return wrap ? list[list.length - 1] : null;
  }

  return list[currentIndex - 1];
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
 * Remove item from list of strings
 * @param list
 * @param target
 * @returns
 */
export const removeItem = (list: Primitive[], target: Primitive): Primitive[] => {
  return list.filter((item) => item !== target);
};

/**
 * Splits list into chunks of given size
 * @param list
 * @param [chunkSize] the size of the chunks the list is being split into
 * @returns
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
 * Splits list into a number of parts
 * @param list
 * @param [numParts] how many parts it should be split into
 * @returns
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

/**
 * Deal n items, modifying the original list
 * @param list
 * @param quantity
 * @returns
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
 * Filter out entries that contained any of the used ids
 * @param dict
 * @param usedIds
 * @returns
 */
export const filterOutByIds = <T>(dict: Record<string, T>, usedIds: BooleanDictionary): Record<string, T> => {
  return Object.keys(dict).reduce((acc: Record<string, T>, entryId: string) => {
    if (!usedIds[entryId]) {
      acc[entryId] = dict[entryId];
    }

    return acc;
  }, {});
};

/**
 * Creates array of given length filled with indexes
 * @param length the length of the array
 * @param startAt the starting value (default: 0)
 * @returns
 */
export const makeArray = (length = 1, startAt = 0): number[] =>
  new Array(length).fill(0).map((e, i) => e + i + startAt);

/**
 * Merges the properties of multiple objects into one object.
 *
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
 * Remove duplicated elements from a list
 * @param arr
 * @returns
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Returns an array of unique items that are present in only one of arrays.
 * @param array1 - The first array to compare.
 * @param array2 - The second array to compare.
 * @returns An array of unique items that are present in one of the arrays.
 */
export function getUniqueItems(array1: any[], array2: any[]): any[] {
  const counts: NumberDictionary = {};

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

export function calculateAverage(values: number[], round = false): number {
  if (!values || values.length === 0) {
    return 0;
  }

  const sum = values.reduce((acc, num) => acc + num, 0);
  const average = sum / values.length;

  if (round) {
    return Math.round(average);
  }

  return average;
}

/**
 * Calculates the longest run of a given value in a list
 * @param values
 * @param value
 * @returns the longest run of a given value in a list
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
