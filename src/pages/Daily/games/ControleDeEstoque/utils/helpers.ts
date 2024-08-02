// import { PalavreadoLetter } from './types';

export const KEYWORD_INDEXES = [0, 5, 10, 15];

export const parseLetters = (letters: string[]): any[] => {
  return letters.map((letter, index) => ({
    letter,
    index,
    state: (KEYWORD_INDEXES.includes(index)
      ? ['0', '1', '2', '3'][KEYWORD_INDEXES.indexOf(index)]
      : 'idle') as any['state'],
    locked: KEYWORD_INDEXES.includes(index),
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
