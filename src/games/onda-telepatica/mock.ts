import { getRandomItem } from '../../utils/helpers';

export const mockGuess = (target: number) => {
  return getRandomItem([
    target,
    target,
    target,
    target,
    ...Array(21)
      .fill(-10)
      .map((e, i) => e + i),
  ]);
};
