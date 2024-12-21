import { loadLocalToday } from 'pages/Daily/utils';
import type { LettersDictionary } from 'pages/Daily/utils/types';
// Utils
import { deepCopy, stringRemoveAccents } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { ArteRuimLocalToday, DailyArteRuimEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: ArteRuimLocalToday = {
  id: '',
  letters: [],
  number: 0,
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
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    solution: getLettersInWord(data.text),
    hearts: SETTINGS.HEARTS,
    guesses: {},
    win: false,
  };

  let solution = { ...state.solution };
  const guesses = localToday.letters.reduce((acc: LettersDictionary, letter) => {
    const isCorrect = state.solution[letter] !== undefined;
    if (state.solution[letter] !== undefined) {
      solution = { ...solution, [letter]: true };
    }
    acc[letter] = {
      letter: letter,
      state: isCorrect ? 'correct' : 'incorrect',
      disabled: true,
    };
    state.hearts = isCorrect ? state.hearts : state.hearts - 1;
    return acc;
  }, {});
  state.solution = solution;

  state.guesses = guesses;
  state.win = Object.values(solution)
    .filter((value) => value !== undefined)
    .every(Boolean);

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
