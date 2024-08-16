import { PalavreadoLetter } from './types';

const KEYWORD_INDEXES: Record<number, number[]> = {
  4: [0, 5, 10, 15],
  5: [0, 6, 12, 18, 24],
};

const KEYWORD_STATES: Record<number, string[]> = {
  4: ['0', '1', '2', '3'],
  5: ['0', '1', '2', '3', '4'],
};

export const parseLetters = (letters: string[], size: number): PalavreadoLetter[] => {
  const indexes = KEYWORD_INDEXES[size];
  const states = KEYWORD_STATES[size];
  return letters.map((letter, index) => ({
    letter,
    index,
    state: (indexes.includes(index) ? states[indexes.indexOf(index)] : 'idle') as PalavreadoLetter['state'],
    locked: indexes.includes(index),
  }));
};

// export const orderLettersByWord = (letters: PalavreadoLetter[], word: string): PalavreadoLetter[] => {
//   const orderedLetters: PalavreadoLetter[] = [];
//   const usedIndexes: number[] = [];
//   word.split('').forEach((wordLetter) => {
//     const foundLetter = letters.find((cl) => !usedIndexes.includes(cl.index) && cl.letter === wordLetter);
//     if (foundLetter) {
//       usedIndexes.push(foundLetter?.index);
//       orderedLetters.push(foundLetter);
//     }
//   });
//   return orderedLetters;
// };

export const calculateGuessValue = (word: string, guess: string): number => {
  let value = 0;
  word.split('').forEach((letter, index) => {
    if (letter === guess[index]) {
      value += 1;
    }
  });
  return value;
};
