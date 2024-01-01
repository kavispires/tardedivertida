import type { Item } from './types';
import { shuffle } from 'utils/helpers';

export const mockPairs = (pool: Item[]) => {
  const mock = shuffle(pool.map((item) => item.id));

  if (pool.length % 2 === 0) {
    return mock;
  }
  mock.pop();
  return mock;
};
