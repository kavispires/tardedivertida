/**
 * Array utility functions for common array operations
 *
 * Provides immutable array manipulation functions including:
 * - Item access (getLastItem)
 * - Item removal (removeItem)
 * - Array creation (makeArray)
 * - Comparison operations (getUniqueItems)
 * - Navigation (getNextItem, getPreviousItem)
 * - Splitting (sliceIntoChunks, sliceInParts)
 */

/**
 * Gets the last item in an array
 *
 * @param list - The array to get the last item from
 * @returns The last item in the array
 * @example
 * getLastItem([1, 2, 3]) // returns 3
 */
export const getLastItem = <T>(list: T[]): T => {
  return list[list.length - 1];
};

/**
 * Removes all occurrences of a specific item from an array and returns a new array
 *
 * Does not mutate the original array.
 *
 * @param list - The array to remove items from
 * @param target - The item value to remove
 * @returns A new array with all occurrences of the target item removed
 * @example
 * removeItem([1, 2, 3, 2, 4], 2) // returns [1, 3, 4]
 */
export const removeItem = (list: Primitive[], target: Primitive): Primitive[] => {
  return list.filter((item) => item !== target);
};

/**
 * Creates an array of sequential numbers with a specified length and starting point
 *
 * @param length - The length of the array to create (default: 1)
 * @param startAt - The starting value for the sequence (default: 0)
 * @returns An array of sequential numbers
 * @example
 * makeArray(3, 5) // returns [5, 6, 7]
 * makeArray(4) // returns [0, 1, 2, 3]
 */
export const makeArray = (length = 1, startAt = 0): number[] =>
  new Array(length).fill(0).map((e, i) => e + i + startAt);

/**
 * Returns items that appear in only one of the two arrays (symmetric difference)
 *
 * Finds items that are unique to either array1 or array2, excluding items
 * that appear in both arrays.
 *
 * @param array1 - The first array to compare
 * @param array2 - The second array to compare
 * @returns An array of items that appear in exactly one of the input arrays
 * @example
 * getUniqueItems([1, 2, 3], [2, 3, 4]) // returns [1, 4]
 */
export function getUniqueItems(array1: any[], array2: any[]): any[] {
  const counts: Dictionary<number> = {};

  // Count occurrences from first array
  array1.forEach((item) => {
    if (counts[item] === undefined) {
      counts[item] = 0;
    }
    counts[item] += 1;
  });

  // Count occurrences from second array
  array2.forEach((item) => {
    if (counts[item] === undefined) {
      counts[item] = 0;
    }
    counts[item] += 1;
  });

  // Return items that appear exactly once across both arrays
  return Object.entries(counts)
    .filter(([, count]) => count === 1)
    .map(([key]) => key);
}

/**
 * Gets the next item in an array, with optional wrapping to the beginning
 *
 * Useful for circular sequences and iteration patterns.
 *
 * @param list - The array to traverse
 * @param currentItem - The current item to find the successor of
 * @param wrap - Whether to wrap around to the first item after the last (default: true)
 * @returns The next item in the array, or null if at end without wrapping
 * @example
 * getNextItem(['a', 'b', 'c'], 'b') // returns 'c'
 * getNextItem(['a', 'b', 'c'], 'c') // returns 'a' (wraps)
 * getNextItem(['a', 'b', 'c'], 'c', false) // returns null (no wrap)
 */
export const getNextItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.indexOf(currentItem);

  if (currentIndex === -1) return null;

  if (currentIndex === list.length - 1) {
    return wrap ? list[0] : null;
  }

  return list[currentIndex + 1];
};

/**
 * Gets the previous item in an array, with optional wrapping to the end
 *
 * Useful for reverse traversal in circular sequences.
 *
 * @param list - The array to traverse
 * @param currentItem - The current item to find the predecessor of
 * @param wrap - Whether to wrap around to the last item before the first (default: true)
 * @returns The previous item in the array, or null if at start without wrapping
 * @example
 * getPreviousItem(['a', 'b', 'c'], 'b') // returns 'a'
 * getPreviousItem(['a', 'b', 'c'], 'a') // returns 'c' (wraps)
 * getPreviousItem(['a', 'b', 'c'], 'a', false) // returns null (no wrap)
 */
export const getPreviousItem = (list: Primitive[], currentItem: Primitive, wrap = true): Primitive => {
  const currentIndex = list.indexOf(currentItem);

  if (currentIndex === -1) return null;

  if (currentIndex === 0) {
    return wrap ? list[list.length - 1] : null;
  }

  return list[currentIndex - 1];
};

/**
 * Splits an array into chunks of a specified size
 *
 * The last chunk may be smaller if the array length is not evenly divisible
 * by the chunk size.
 *
 * @param list - The array to split
 * @param chunkSize - The size of each chunk (default: 2)
 * @returns A 2D array of chunks
 * @example
 * sliceIntoChunks([1, 2, 3, 4, 5], 2) // returns [[1, 2], [3, 4], [5]]
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
 * Splits an array into a specified number of approximately equal parts
 *
 * Distributes items as evenly as possible when the array length is not
 * evenly divisible by the number of parts.
 *
 * @param list - The array to split
 * @param numParts - The number of parts to split into (default: 1)
 * @returns A 2D array of parts
 * @example
 * sliceInParts([1, 2, 3, 4, 5], 2) // returns [[1, 2, 3], [4, 5]]
 * sliceInParts([1, 2, 3, 4, 5, 6], 3) // returns [[1, 2], [3, 4], [5, 6]]
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
    let remainingParts = numParts;
    while (i < list.length) {
      const partSize = Math.ceil((list.length - i) / remainingParts--);
      const end = i + partSize;
      res.push(list.slice(i, end));
      i = end;
    }
  }

  return res;
};
