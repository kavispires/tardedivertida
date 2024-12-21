import { shuffle } from 'lodash';
// Utils
import { getEntryId, getRandomItem } from 'utils/helpers';
// Internal
import type { Question } from './types';

export const mockAnswers = (userId: PlayerId, numAnswers: number) => {
  const list = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar', 'pêssego'];
  const list2 = ['água', 'bola', 'cocô', 'dedo', 'égua', 'flauta', 'gatilho', 'helio', 'jipe'];

  const shuffled = shuffle(Math.random() > 0.5 ? list : list2);

  return Array(numAnswers)
    .fill(0)
    .map((i, index) => ({ [getEntryId(['answer', `${index}`, userId])]: shuffled[i + index].toUpperCase() }))
    .reduce((acc: Record<string, string>, item) => {
      const newAcc = Object.assign({}, acc, item);
      return newAcc;
    }, {});
};

export const mockSelectQuestion = (questions: Question[]) => getRandomItem(questions).id;
