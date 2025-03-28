// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { TableEntry } from './types';

const randomWords = ['avocado', 'bell pepper', 'crustaceous', 'dinner'];

export function mockStory(hand: string[]) {
  return {
    story: getRandomItem(randomWords),
    cardId: getRandomItem(hand),
  };
}

export function mockPlayCard(hand: string[]) {
  return {
    cardId: getRandomItem(hand),
  };
}

export function mockVote(table: TableEntry[], playerCardId: string) {
  return {
    vote: getRandomItem(
      table.map((tableEntry) => tableEntry.cardId).filter((cardId) => playerCardId !== cardId),
    ),
  };
}
