import { NEGATIVE_SCALE, POSITIVE_SCALE } from './constants';

export const getReference = (kind: string) => {
  return kind === 'positive' ? POSITIVE_SCALE : NEGATIVE_SCALE;
};
