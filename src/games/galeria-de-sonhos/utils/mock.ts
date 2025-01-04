import { sample } from 'lodash';
// Utils
import { shuffle } from 'utils/helpers';
// Internal
import type { ImageCardObj } from './types';

export const mockDreamSelection = (cards: ImageCardObj[], minimumSelection: number): string[] => {
  const selectionOrder = sample([
    [2, 11, 6, 8, 9, 3, 13],
    [2, 11, 8, 4, 9, 3, 13],
    [2, 6, 1, 5, 9, 3, 13],
  ]);
  const countSource = minimumSelection === 4 ? [4, 4, 4, 4, 5, 6] : [2, 3, 3, 3, 3, 4, 4, 5, 6];
  const numberOfCards = shuffle(countSource)[0];
  const selections = selectionOrder.slice(0, numberOfCards);
  return selections.map((cardIndex) => cards[cardIndex].id);
};
