import { sample, sampleSize } from 'lodash';
// Internal
import type { Character } from './types';

export const mockSelectCharacters = (characters: Character[]) => {
  return sampleSize(characters, 6).map((c) => c.id);
};

export const mockGlyphs = (glyphs: string[]) => {
  const positiveQuantity = sample([1, 1, 2, 2, 2, 3]) ?? 2;
  const negativeQuantity = sample([0, 0, 0, 1, 1, 1, 2, 2, 3]) ?? 0;
  const selected = glyphs.slice(0, positiveQuantity + negativeQuantity);
  const dict: BooleanDictionary = {};
  selected.slice(0, positiveQuantity).forEach((key) => {
    dict[key] = true;
  });
  selected.slice(positiveQuantity).forEach((key) => {
    dict[key] = false;
  });

  return dict;
};
