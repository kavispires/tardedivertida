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

/**
 * Calculates the Sørensen-Dice coefficient of two strings
 * Uses bigram comparison to measure string similarity, returning a value between 0 and 1
 * where 1 indicates identical strings and 0 indicates no similarity
 * @param first - The first string to compare
 * @param second - The second string to compare
 * @returns A number between 0 and 1 representing the similarity coefficient
 * @example
 * compareTwoStrings('hello', 'hallo') // returns ~0.75
 * compareTwoStrings('same', 'same') // returns 1
 * compareTwoStrings('abc', 'xyz') // returns 0
 */
export function compareTwoStrings(first: string, second: string): number {
  // Strip all whitespace before comparing
  const firstCleaned = first.replace(/\s+/g, '');
  const secondCleaned = second.replace(/\s+/g, '');

  if (firstCleaned === secondCleaned) return 1; // Identical strings or both empty
  if (firstCleaned.length < 2 || secondCleaned.length < 2) return 0; // Needs at least 2 chars for a bigram

  const firstBigrams = new Map<string, number>();

  // Create bigrams for the first string
  for (let i = 0; i < firstCleaned.length - 1; i++) {
    const bigram = firstCleaned.substring(i, i + 2);
    const count = firstBigrams.get(bigram) || 0;
    firstBigrams.set(bigram, count + 1);
  }

  let intersectionSize = 0;

  // Check bigrams in the second string against the first
  for (let i = 0; i < secondCleaned.length - 1; i++) {
    const bigram = secondCleaned.substring(i, i + 2);
    const count = firstBigrams.get(bigram) || 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  // Sørensen-Dice coefficient formula: (2 * intersection) / (length1 + length2)
  return (2.0 * intersectionSize) / (firstCleaned.length + secondCleaned.length - 2);
}

export interface Rating {
  target: string;
  rating: number;
}

export interface BestMatchResult {
  ratings: Rating[];
  bestMatch: Rating;
  bestMatchIndex: number;
}

/**
 * Compares a main string against an array of target strings to find the best match
 * Uses Sørensen-Dice coefficient to calculate similarity ratings for each target
 * @param mainString - The string to compare against targets
 * @param targetStrings - Array of strings to compare with the main string
 * @returns Object containing all ratings, the best match, and its index
 * @throws Error if targetStrings is empty or undefined
 * @example
 * findBestMatch('apple', ['apples', 'banana', 'apply'])
 * returns { ratings: [...], bestMatch: { target: 'apples', rating: 0.8 }, bestMatchIndex: 0 }
 */
export function findBestMatch(mainString: string, targetStrings: string[]): BestMatchResult {
  if (!targetStrings || targetStrings.length === 0) {
    throw new Error('Bad arguments: targetStrings cannot be empty');
  }

  const ratings: Rating[] = [];
  let bestMatchIndex = 0;
  let bestMatchRating = 0;

  for (let i = 0; i < targetStrings.length; i++) {
    const target = targetStrings[i];
    const rating = compareTwoStrings(mainString, target);

    ratings.push({ target, rating });

    if (rating > bestMatchRating) {
      bestMatchRating = rating;
      bestMatchIndex = i;
    }
  }

  return {
    ratings,
    bestMatch: ratings[bestMatchIndex],
    bestMatchIndex,
  };
}
