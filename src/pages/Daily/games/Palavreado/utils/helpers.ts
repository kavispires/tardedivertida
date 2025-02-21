import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Internal
import { SETTINGS } from './settings';
import type { DailyPalavreadoEntry, GameState, PalavreadoLetter } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  boardState: [],
  swaps: 0,
  letters: [],
  guesses: [],
};

export const getInitialState = (data: DailyPalavreadoEntry): GameState => {
  const size = data.keyword.length;

  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      letters: parseLetters(data.letters, size),
      hearts: Math.max(SETTINGS.HEARTS, size),
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    letters: localToday.letters,
    boardState: localToday.boardState,
    guesses: localToday.guesses,
    hearts: localToday.hearts,
    swaps: localToday.swaps,
  };

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

export const calculateGuessValue = (word: string, guess: string): number => {
  let value = 0;
  word.split('').forEach((letter, index) => {
    if (letter === guess[index]) {
      value += 1;
    }
  });
  return value;
};
