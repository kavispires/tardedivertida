// Utils
import { shuffle } from 'utils/helpers';
// Internal
import type { Item } from './types';

/**
 * Generates pairs from a pool of items.
 * Has a 70% chance of returning pairs in original order vs 30% chance to shuffle.
 */
export const mockPairs = (pool: Item[]) => {
  // 70% chance to return original order, 30% chance to shuffle
  const shouldShuffle = Math.random() >= 0.7;

  const itemIds = pool.map((item) => item.id);
  const mock = shouldShuffle ? shuffle(itemIds) : itemIds;

  // If odd number of items, remove one to ensure pairs
  if (pool.length % 2 === 0) {
    return mock;
  }
  mock.pop();
  return mock;
};
