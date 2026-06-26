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

/**
 * Generic utility to extract a property from an array or record and create a constant object
 * @param source - Array of objects or Record of objects
 * @param propertyKey - The property key to extract from each object
 * @returns Object with extracted values as both keys and values
 * @example
 * const items = [{ id: 1, status: 'ACTIVE' }, { id: 2, status: 'PENDING' }];
 * const statuses = extractPropertyAsConst(items, 'status');
 * Result: { ACTIVE: 'ACTIVE', PENDING: 'PENDING' }
 */
export function extractPropertyAsConst<
  const T extends readonly Record<string, unknown>[] | Record<string, Record<string, unknown>>,
  K extends string,
>(source: T, propertyKey: K) {
  const result = {} as Record<string, string>;

  if (Array.isArray(source)) {
    for (const item of source) {
      if (propertyKey in item && typeof item[propertyKey] === 'string') {
        result[item[propertyKey] as string] = item[propertyKey] as string;
      }
    }
  } else {
    for (const item of Object.values(source)) {
      if (propertyKey in item && typeof item[propertyKey] === 'string') {
        result[item[propertyKey] as string] = item[propertyKey] as string;
      }
    }
  }

  return result;
}

/**
 * Type helper to extract property values as literal types from arrays or records
 * Automatically chooses the correct extraction based on input type
 */
export type ExtractPropertyAsConst<
  T extends readonly Record<string, unknown>[] | Record<string, Record<string, unknown>>,
  K extends string,
> = T extends readonly Record<string, unknown>[]
  ? { readonly [V in Extract<T[number], Record<K, string>>[K]]: V }
  : T extends Record<string, Record<string, unknown>>
    ? { readonly [V in Extract<T[keyof T], Record<K, string>>[K]]: V }
    : never;
