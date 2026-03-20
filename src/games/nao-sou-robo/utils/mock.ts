import { sample, sampleSize } from 'lodash';

export const mockCardPick = (hand: UID[]) => {
  return sample(hand) ?? hand[0];
};

export const mockGuess = (cards: UID[], playerCount: number, userCardId: UID) => {
  const options = cards.filter((card) => card !== userCardId);

  return [userCardId, ...sampleSize(options, playerCount - 1)];
};
