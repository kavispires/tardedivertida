import { sampleSize } from 'lodash';

const suggestions = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];

export const mockSuggestions = (suggestionsNumber: number): { suggestions: string[] } => {
  return { suggestions: sampleSize(suggestions, suggestionsNumber) };
};
