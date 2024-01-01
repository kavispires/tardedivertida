// Types
import type { ImageCardObj } from './types';
// Utils
import { shuffle } from 'utils/helpers';

export const mockDreamSelection = (cards: ImageCardObj[], hardMode: boolean): string[] => {
  const selectionOrder = [2, 11, 6, 8, 9, 3, 13];
  const countSource = hardMode ? [4, 4, 4, 4, 5, 6] : [1, 2, 3, 3, 3, 4, 4, 5, 6];
  const numberOfCards = shuffle(countSource)[0];
  const selections = selectionOrder.slice(0, numberOfCards);
  return selections.map((cardIndex) => cards[cardIndex].id);
};
