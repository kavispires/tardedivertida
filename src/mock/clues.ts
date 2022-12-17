import { getRandomItem } from 'utils/helpers';

const clues = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];

export const mockClue = (): string => {
  return getRandomItem(clues);
};
