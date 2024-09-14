// Utils
import { shuffle } from 'utils/helpers';
// Internal
import type { Item } from './types';

export const mockPairs = (pool: Item[]) => {
  const mock = shuffle(pool.map((item) => item.id));

  if (pool.length % 2 === 0) {
    return mock;
  }
  mock.pop();
  return mock;
};
