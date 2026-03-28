import { sampleSize } from 'lodash';

export const mockCardPicks = (hand: UID[], quantity: number) => {
  return sampleSize(hand, quantity);
};

export const mockGuess = (cards: UID[], playerCount: number, userCardId: UID) => {
  const options = cards.filter((card) => card !== userCardId);

  return [userCardId, ...sampleSize(options, playerCount - 1)];
};
