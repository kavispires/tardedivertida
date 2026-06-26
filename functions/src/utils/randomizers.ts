import { sampleSize } from 'lodash';
// Internal
import { buildBooleanDictionary } from './object';

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
