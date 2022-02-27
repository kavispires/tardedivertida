import { shuffle } from 'lodash';
import { getEntryId } from '../../utils/helpers';

export const mockAnswers = (userId: PlayerId, numAnswers: number) => {
  const list = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];
  const list2 = ['água', 'bola', 'cocô', 'dedo', 'égua', 'flauta', 'gatilho', 'helio', 'jipe'];

  const shuffled = shuffle(Math.random() > 0.5 ? list : list2);

  return Array(numAnswers)
    .fill(0)
    .map((i, index) => ({ [getEntryId(['answer', `${index}`, userId])]: shuffled[i + index].toUpperCase() }))
    .reduce((acc, item) => {
      acc = { ...acc, ...item };
      return acc;
    }, {});
};
