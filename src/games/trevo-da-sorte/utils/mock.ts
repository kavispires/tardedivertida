import { shuffle } from 'utils/helpers';
import { WORST_TO_REMOVE } from './constants';
import { sampleSize } from 'lodash';

export const mockSelectCards = (cards: TextCard[]): CardId[] =>
  shuffle(cards)
    .slice(0, WORST_TO_REMOVE)
    .map((card) => card.id);

const clues = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];

export const mockClues = (): { clues: string[] } => {
  return { clues: sampleSize(clues, 4) };
};
