// Types
import type { TextCard } from 'types/tdr';
// Utils
import { shuffle } from 'utils/helpers';

export const mockOrder = (scenarios: TextCard[]) => {
  const firstHalf = shuffle([scenarios[0], scenarios[1], scenarios[2]]);
  const secondHalf = shuffle([scenarios[3], scenarios[4]]);

  return [...firstHalf, ...secondHalf];
};
