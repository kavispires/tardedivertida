import { loadLocalToday } from 'pages/Daily/utils';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { deepCopy } from 'utils/helpers';

import { SETTINGS } from './settings';
import { DailyFilmacoEntry, FilmacoLocalToday, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: FilmacoLocalToday = {
  id: '',
  letters: [],
  number: 0,
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyFilmacoEntry object containing the necessary data for the game.
 * @returns The initial GameState object.
 */
export const getInitialState = (data: DailyFilmacoEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    solution: getLettersInWord(data.title, true),
    hearts: SETTINGS.HEARTS,
    guesses: {},
  };

  if (localToday) {
    let hearts = SETTINGS.HEARTS;
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
      hearts = isCorrect ? hearts : hearts - 1;
      return acc;
    }, {});

    state.guesses = guesses;
    state.hearts = hearts;
    state.solution = solution;
  }

  return state;
};

/**
 * Returns an object with each letter in the word as a key and a boolean value indicating if the letter has been found.
 * @param text - The word to extract the letters from.
 * @returns An object with each letter in the word as a key and a boolean value indicating if the letter has been found.
 */
export function getLettersInWord(text: string, allowNumbers?: boolean): BooleanDictionary {
  const cleanedUpText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const letters = cleanedUpText.split('');
  const lettersInWord: BooleanDictionary = {};

  letters.forEach((letter) => {
    if (allowNumbers) {
      if (letter.match(/[a-zA-Z0-9]/)) {
        lettersInWord[letter] = false;
      }
    } else {
      if (letter.match(/[a-zA-Z]/)) {
        lettersInWord[letter] = false;
      }
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
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Checks if a character is a letter.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a letter, `false` otherwise.
 */
export function isLetter(char: string, allowNumbers?: boolean): boolean {
  if (allowNumbers) {
    return cleanupLetter(char).match(/[a-zA-Z0-9]/) !== null;
  }
  return cleanupLetter(char).match(/[a-zA-Z]/) !== null;
}
