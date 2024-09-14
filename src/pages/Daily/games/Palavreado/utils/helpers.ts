import { chunk, cloneDeep } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import { DailyPalavreadoEntry, GameState, PalavreadoLetter, PalavreadoLocalToday } from './types';

export const DEFAULT_LOCAL_TODAY: PalavreadoLocalToday = {
  id: '',
  boardState: [],
  number: 0,
  swaps: 0,
};

export const getInitialState = (data: DailyPalavreadoEntry): GameState => {
  const size = data.keyword.length;

  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    selection: null,
    swap: [],
    letters: parseLetters(data.letters, size),
    boardState: [],
    guesses: [],
    hearts: Math.max(SETTINGS.HEARTS, size),
    state: '',
    swaps: 0,
  };

  if (localToday.boardState) {
    const hearts = Math.max(SETTINGS.HEARTS, size) - localToday.boardState.length;

    // Read state of the board and apply guesses
    const lsGuesses = (localToday.boardState ?? []).map((board) => {
      const guess = chunk(board, size);
      return guess.map((g) => g.join(''));
    });

    // Apply latest board state
    const latestBoardState = localToday.boardState[localToday.boardState.length - 1];
    const copyLetters = cloneDeep(state.letters);
    const answer = data.words.join('');
    if (latestBoardState) {
      copyLetters.forEach((letter, index) => {
        letter.letter = latestBoardState[index];

        if (letter.state === 'idle' && letter.letter === answer[index]) {
          letter.state = String(Math.floor(index / size)) as PalavreadoLetter['state'];
          letter.locked = true;
        }

        return letter;
      });
    }

    state.hearts = hearts;
    state.guesses = lsGuesses;
    state.letters = copyLetters;
    state.boardState = localToday.boardState ?? [];
    state.swaps = localToday.swaps ?? 0;
  }

  return state;
};

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
