import { getRandomItem, shuffle } from 'utils/helpers';
import { ROTATIONS, WORST_TO_REMOVE } from './constants';
import { sampleSize } from 'lodash';

export const mockSelectCards = (cards: TextCard[]): CardId[] =>
  shuffle(cards)
    .slice(0, WORST_TO_REMOVE)
    .map((card) => card.id);

const clues = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];

export const mockClues = (): { clues: string[] } => {
  return { clues: sampleSize(clues, 4) };
};

const mockedScore = [3, 1, 1, 1, 0, 0];

export const mockGuesses = (leaves: Leaves): YGuesses => {
  const selected = sampleSize(Object.keys(leaves), 4);

  return {
    A: {
      leafId: selected[0],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    B: {
      leafId: selected[1],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    C: {
      leafId: selected[2],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
    D: {
      leafId: selected[3],
      rotation: getRandomItem(ROTATIONS),
      score: getRandomItem(mockedScore),
      tries: 2,
    },
  };
};
