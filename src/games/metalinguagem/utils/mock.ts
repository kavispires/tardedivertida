import { sample } from 'lodash';
import { mockClue } from 'mock/clues';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { SubmitWordPayload, WordLength } from './types';
import { WORD_LENGTH_STATUS } from './constants';

export function mockNewWord(wordLengths: WordLength[]): SubmitWordPayload {
  const names: string[] = [];
  while (names.length < 2) {
    const name = mockClue('high');
    if (!names.includes(name)) {
      names.push(name);
    }
  }

  const availableLengths = wordLengths
    .filter((wl) => wl.status !== WORD_LENGTH_STATUS.SOLVED)
    .map((wl) => wl.wordLength);

  const selectedLength = getRandomItem(availableLengths);
  const firstSyllableLength = Math.floor(selectedLength / 2);
  const secondSyllableLength = Math.ceil(selectedLength / 2);

  const newWord =
    names[0].slice(0, firstSyllableLength) + names[1].slice(names[1].length - secondSyllableLength);

  return {
    names,
    indexes: [firstSyllableLength, secondSyllableLength],
    newWord,
  };
}

export function mockGuess(itemsIds: string[], beginsWith: string, endsWith: string): string[] {
  const options = [...itemsIds, beginsWith, endsWith, beginsWith, endsWith, beginsWith, endsWith, beginsWith];

  const first = sample(options) || options[0];
  const second = sample(options.filter((option) => option !== first)) || options[2];
  return [first, second];
}
