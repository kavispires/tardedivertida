/**
 * Object and dictionary utility functions
 *
 * Provides utilities for working with objects and dictionaries including:
 * - Dictionary construction (buildBooleanDictionary)
 */

/**
 * Builds a Dictionary<boolean> from a list of strings or objects with an 'id' property
 *
 * Useful for creating lookup tables or tracking sets of items efficiently.
 *
 * @param list - Array of strings or objects with an 'id' property
 * @param key - Property key to extract from objects (default: 'id')
 * @returns A dictionary mapping keys to true
 * @example
 * buildBooleanDictionary(['a', 'b', 'c']) // returns { a: true, b: true, c: true }
 * buildBooleanDictionary([{ id: '1' }, { id: '2' }]) // returns { '1': true, '2': true }
 * buildBooleanDictionary([{ code: 'x' }, { code: 'y' }], 'code') // returns { x: true, y: true }
 */
export const buildBooleanDictionary = <T>(list: T[], key = 'id'): Dictionary<boolean> => {
  return list.reduce((acc: Dictionary<boolean>, entry) => {
    const value = typeof entry === 'string' ? entry : entry[key];
    acc[value] = true;
    return acc;
  }, {});
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
