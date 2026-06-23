import { shuffle } from 'lodash';
// Utils
import { getToday } from '@utils/helpers';
// Internal
import type { GameState, PairToEvaluate } from './types';
import { SETTINGS } from './settings';

/**
 * Get the initial game state from localStorage or create a new one
 */
export function getInitialState(id: string, number: number): GameState {
  const lsKey = `${SETTINGS.TD_DAILY_CONEXOES_LOCAL_TODAY}_${getToday()}`;
  const stored = localStorage.getItem(lsKey);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error('Failed to parse conexoes state from localStorage', e);
    }
  }

  return {
    id,
    number,
    played: false,
  };
}

/**
 * Save the game state to localStorage
 */
export function saveGameState(state: GameState): void {
  const lsKey = `${SETTINGS.TD_DAILY_CONEXOES_LOCAL_TODAY}_${getToday()}`;
  localStorage.setItem(lsKey, JSON.stringify(state));
}

/**
 * Create a unique pair ID from two image IDs (sorted alphabetically to ensure consistency)
 */
export function createPairId(imageId1: string, imageId2: string): string {
  return [imageId1, imageId2].sort().join('::');
}

/**
 * Generate unique pairs from the given imageIds array, avoiding pairs in the excludedPairIds set
 * Algorithm: Shuffle imageIds and create pairs, ensuring no pair was previously evaluated
 */
export function generatePairs(
  imageIds: string[],
  excludedPairIds: Set<string>,
  batchSize = 20,
): PairToEvaluate[] {
  const pairs: PairToEvaluate[] = [];
  const shuffledIds = shuffle([...imageIds]);
  const usageCount: Record<string, number> = {};

  // Initialize usage count
  for (const id of shuffledIds) {
    usageCount[id] = 0;
  }

  let attempts = 0;
  const maxAttempts = shuffledIds.length * shuffledIds.length; // Prevent infinite loops

  while (pairs.length < batchSize && attempts < maxAttempts) {
    attempts++;

    // Find the least used card
    const sortedByUsage = Object.entries(usageCount).sort((a, b) => a[1] - b[1]);
    const [imageId1] = sortedByUsage[0];

    // Try to pair with another least-used card
    for (let i = 1; i < sortedByUsage.length; i++) {
      const [imageId2] = sortedByUsage[i];

      if (imageId1 === imageId2) continue;

      const pairId = createPairId(imageId1, imageId2);

      // Skip if this pair was already evaluated
      if (excludedPairIds.has(pairId)) continue;

      // Create the pair
      const [sortedId1, sortedId2] = [imageId1, imageId2].sort();
      pairs.push({
        pairId,
        imageId1: sortedId1,
        imageId2: sortedId2,
      });

      // Update usage count
      usageCount[imageId1]++;
      usageCount[imageId2]++;

      // Mark this pair as used
      excludedPairIds.add(pairId);

      break;
    }
  }

  return pairs;
}
