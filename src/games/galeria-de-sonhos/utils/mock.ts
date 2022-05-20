import { shuffle } from 'utils/helpers';

export const mockDreamSelection = (cards: GImageCard[]): string[] => {
  const selectionOrder = [2, 11, 6, 8, 9, 3, 13];
  const numberOfCards = shuffle([1, 2, 3, 3, 3, 4, 4, 5, 6])[0];
  const selections = selectionOrder.slice(0, numberOfCards);
  return selections.map((cardIndex) => cards[cardIndex].id);
};
