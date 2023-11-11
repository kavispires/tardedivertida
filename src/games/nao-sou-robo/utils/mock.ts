import { sample, sampleSize } from 'lodash';

export const mockCardPick = (hand: CardId[]) => {
  return sample(hand) ?? hand[0];
};

export const mockGuess = (cards: CardId[], playerCount: number, userCardId: CardId) => {
  const options = cards.filter((card) => card !== userCardId);

  return [userCardId, ...sampleSize(options, playerCount - 1)];
};
