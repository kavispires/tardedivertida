import { sample, sampleSize } from 'lodash';

export function mockCardPlay(hand: string[], isCreator: boolean) {
  if (isCreator) {
    // Creator must select at least 2 cards, rarely 3
    return sampleSize(hand, sample([2, 2, 2, 2, 2, 2, 2, 2, 2, 3]) ?? 2);
  }

  // Other players usually select 0 or 1 card
  return sampleSize(hand, sample([0, 0, 0, 0, 1, 1, 1, 2]) ?? 0);
}

export function mockEvaluations(evaluations: Record<string, null | boolean>): Dictionary<boolean> {
  return Object.keys(evaluations).reduce(
    (acc, itemId) => {
      acc[itemId] = sample([true, true, true, true, true, false]) as boolean;
      return acc;
    },
    {} as Dictionary<boolean>,
  );
}
