// Types
import { SpectrumCard } from 'types/tdr';
// Utils
import { getRandomItem } from 'utils/helpers';

export const mockGuess = (target: number): number => {
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

export const mockHint = (card: SpectrumCard, target: number): string => {
  if (target < 0) {
    return `${card.left}:${Math.abs(target)}`;
  }

  if (target > 0) {
    return `${card.right}:${Math.abs(target)}`;
  }

  return `0:0`;
};
