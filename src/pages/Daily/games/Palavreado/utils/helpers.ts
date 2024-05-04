import { PalavreadoLetter } from './type';

export const parseLetters = (letters: string[]): PalavreadoLetter[] => {
  return letters.map((letter, index) => ({
    letter,
    index,
    state: 'idle',
    locked: false,
  }));
};

export const orderLettersByWord = (letters: PalavreadoLetter[], word: string): PalavreadoLetter[] => {
  const orderedLetters: PalavreadoLetter[] = [];
  const usedIndexes: number[] = [];
  word.split('').forEach((wordLetter) => {
    const foundLetter = letters.find((cl) => !usedIndexes.includes(cl.index) && cl.letter === wordLetter);
    if (foundLetter) {
      usedIndexes.push(foundLetter?.index);
      orderedLetters.push(foundLetter);
    }
  });
  return orderedLetters;
};

export const calculateGuessValue = (word: string, guess: string): number => {
  let value = 0;
  word.split('').forEach((letter, index) => {
    if (letter === guess[index]) {
      value += 1;
    }
  });
  return value;
};
