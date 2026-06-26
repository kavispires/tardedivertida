/**
 * String utility functions for text manipulation
 *
 * Provides string processing utilities including:
 * - Accent removal (stringRemoveAccents)
 */

/**
 * Removes accents and diacritical marks from a string while keeping base letters
 *
 * Normalizes the string using NFD (Canonical Decomposition) and removes
 * all combining diacritical marks.
 *
 * @param str - The string to remove accents from
 * @returns The string without accents or diacritical marks
 * @example
 * stringRemoveAccents('café') // returns 'cafe'
 * stringRemoveAccents('naïve') // returns 'naive'
 * stringRemoveAccents('São Paulo') // returns 'Sao Paulo'
 */
export function stringRemoveAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
