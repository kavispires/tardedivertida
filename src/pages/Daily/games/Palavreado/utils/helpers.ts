import { cloneDeep, merge } from 'lodash';
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
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

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  swaps,
  guesses,
  words,
  totalHearts,
  ...rest
}: BasicResultsOptions & {
  swaps: number;
  guesses: string[][];
  words: string[];
}): string {
  const size = guesses[0].length;
  const colors = ['🟥', '🟦', '🟪', '🟫', '🟧'];
  const cleanUpAttempts = guesses.map((attempt) => {
    return attempt.map((word, i) => {
      const wordState = words[i].toLowerCase() === word.toLowerCase() ? colors[i] : '⬜️';
      return wordState;
    });
  });
  if (cleanUpAttempts.length < size) {
    while (cleanUpAttempts.length < size) {
      cleanUpAttempts.push(cleanUpAttempts[cleanUpAttempts.length - 1]);
    }
  }

  const correctTotalHearts = Math.max(totalHearts, size);

  return generateShareableResult({
    heartsSuffix: ` (${swaps} trocas)`,
    totalHearts: correctTotalHearts,
    additionalLines: cleanUpAttempts.map((row) => row.join(' ').trim()).filter(Boolean),
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyPalavreadoEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({
  data,
  language,
}: {
  data: DailyPalavreadoEntry;
  language: Language;
}) {
  const state = getInitialState(data);
  return writeResult({
    type: 'arte-ruim',
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    swaps: state.swaps,
    guesses: state.guesses,
    words: data.words,
  });
}
