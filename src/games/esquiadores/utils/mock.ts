import { sample } from 'lodash';

export const mockChoices = (): string[] => {
  const choices = ['left', 'right'];
  return [sample(choices) ?? 'left', sample(choices) ?? 'right', sample(choices) ?? 'left'];
};

const pools: Dictionary<number[]> = {
  0: [0, 1, 2, 3, 4, 5],
  1: [0, 1, 2, 3],
  2: [2, 3, 4, 5],
  3: [0, 1],
  4: [2, 3],
  5: [4, 5],
};
export const mockBets = (bettingChips: number, animateFrom: number): Dictionary<number> => {
  const bets: Dictionary<number> = {};

  const pool = pools[animateFrom];

  for (let i = 0; i < bettingChips; i++) {
    const lodge = sample(pool);
    if (lodge !== undefined) {
      bets[lodge] = (bets[lodge] ?? 0) + 1;
    }
  }

  return bets;
};

export const mockSkierBets = (bettingChips: number): Dictionary<number> => {
  const bets: Dictionary<number> = {};

  const lodges = [0, 1, 2, 3, 4, 5];

  for (let i = 0; i < bettingChips; i++) {
    const lodge = sample(lodges) ?? 0;
    bets[lodge] = (bets[lodge] ?? 0) + 1;
  }

  return bets;
};
