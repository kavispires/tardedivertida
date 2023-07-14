import { sampleSize } from 'lodash';

export const mockNewMap = (hand: ExtendedTextCard): ExtendedTextCard[] => {
  return sampleSize<ExtendedTextCard>(hand, 3).map((card) => ({
    ...card,
    negate: Math.random() > 0.75,
  }));
};
