import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Utils
import { stringRemoveAccents } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { DailyArteRuimEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  solution: {},
  guesses: {},
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyArteRuimEntry object containing the necessary data.
 * @returns The initial GameState object.
 */
export function getInitialState(data: DailyArteRuimEntry): GameState {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      solution: getLettersInWord(data.text),
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    solution: localToday.solution,
    hearts: localToday.hearts,
    guesses: localToday.guesses,
  };

  return state;
}

/**
 * Returns an object with each letter in the word as a key and a boolean value indicating if the letter has been found.
 * @param text - The word to extract the letters from.
 * @returns An object with each letter in the word as a key and a boolean value indicating if the letter has been found.
 */
export function getLettersInWord(text: string): BooleanDictionary {
  const cleanedUpText = stringRemoveAccents(text).toLowerCase();
  const letters = cleanedUpText.split('');
  const lettersInWord: BooleanDictionary = {};

  letters.forEach((letter) => {
    if (letter.match(/[a-zA-Z]/)) {
      lettersInWord[letter] = false;
    }
  });

  return lettersInWord;
}

/**
 * Removes diacritical marks from a given character and converts it to lowercase.
 *
 * @param char - The character to be cleaned up.
 * @returns The cleaned up character.
 */
export function cleanupLetter(char: string): string {
  return stringRemoveAccents(char).toLowerCase();
}

/**
 * Checks if a character is a letter.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a letter, `false` otherwise.
 */
export function isLetter(char: string): boolean {
  return cleanupLetter(char).match(/[a-zA-Z]/) !== null;
}
