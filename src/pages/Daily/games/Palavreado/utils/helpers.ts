import { cloneDeep, merge, shuffle } from 'lodash';
// Utils
import { stringRemoveAccents } from 'utils/helpers';
// Pages
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
  usedSmartShuffle: false,
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
    usedSmartShuffle: localToday.usedSmartShuffle,
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
    id: `tile-${index}-${letter}`,
    letter,
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
 * Checks if a letter is a vowel (including Portuguese accented vowels).
 */
export const isVowel = (letter: string): boolean => {
  const normalized = stringRemoveAccents(letter.toLowerCase());
  return 'aeiou'.includes(normalized);
};

/**
 * Checks if a letter is a consonant.
 */
export const isConsonant = (letter: string): boolean => {
  const normalized = stringRemoveAccents(letter.toLowerCase());
  return /[a-z]/.test(normalized) && !isVowel(letter);
};

/**
 * Intelligently shuffles incorrectly placed letters, respecting vowel/consonant types
 * and avoiding previously guessed positions.
 */
export const smartShuffle = (
  letters: PalavreadoLetter[],
  guesses: string[][],
  size: number,
): PalavreadoLetter[] => {
  const copyLetters = cloneDeep(letters);

  // Identify unlocked letters that are incorrectly placed
  const incorrectLetters = copyLetters
    .map((letter, index) => ({ letter, index }))
    .filter(({ letter }) => !letter.locked);

  if (incorrectLetters.length === 0) {
    return copyLetters;
  }

  // Build a map of previously guessed positions for each letter
  const previouslyGuessed = new Map<string, Set<number>>();
  guesses.forEach((attempt) => {
    attempt.forEach((word, wordIndex) => {
      word.split('').forEach((char, charIndex) => {
        const globalIndex = wordIndex * size + charIndex;
        if (!previouslyGuessed.has(char)) {
          previouslyGuessed.set(char, new Set());
        }
        const charSet = previouslyGuessed.get(char);
        if (charSet) {
          charSet.add(globalIndex);
        }
      });
    });
  });

  // Separate into vowels and consonants
  const vowelIndices: number[] = [];
  const consonantIndices: number[] = [];

  incorrectLetters.forEach(({ letter, index }) => {
    if (isVowel(letter.letter)) {
      vowelIndices.push(index);
    } else if (isConsonant(letter.letter)) {
      consonantIndices.push(index);
    }
  });

  // Helper function to check if a swap is valid
  const isValidSwap = (letter: string, targetIndex: number): boolean => {
    const guessedPositions = previouslyGuessed.get(letter);
    return !guessedPositions?.has(targetIndex);
  };

  // Helper function to shuffle within a group
  const shuffleGroup = (indices: number[]) => {
    if (indices.length <= 1) return;

    const shuffledIndices = shuffle([...indices]);
    const letterValues = indices.map((i) => copyLetters[i].letter);

    // Try to place each letter in a valid position
    const assignments: Array<{ index: number; letter: string }> = [];

    for (let i = 0; i < indices.length; i++) {
      const targetIndex = shuffledIndices[i];
      const originalIndex = indices[i];

      // Skip if it's the same position
      if (targetIndex === originalIndex) {
        // Try to find a different valid position
        let swapped = false;
        for (let j = i + 1; j < shuffledIndices.length; j++) {
          const altIndex = shuffledIndices[j];
          if (altIndex !== originalIndex && isValidSwap(letterValues[i], altIndex)) {
            // Swap in shuffledIndices
            [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
            swapped = true;
            break;
          }
        }
        if (!swapped) {
          // Keep in same place if no valid swap found
          shuffledIndices[i] = originalIndex;
        }
      }
    }

    // Apply the shuffled assignments
    for (let i = 0; i < indices.length; i++) {
      const targetIndex = shuffledIndices[i];
      const letter = letterValues[i];

      if (isValidSwap(letter, targetIndex)) {
        assignments.push({ index: targetIndex, letter });
      } else {
        // Fallback: keep in original position
        assignments.push({ index: indices[i], letter });
      }
    }

    // Apply assignments
    assignments.forEach(({ index, letter }) => {
      copyLetters[index].letter = letter;
    });
  };

  // Shuffle vowels and consonants separately
  shuffleGroup(vowelIndices);
  shuffleGroup(consonantIndices);

  return copyLetters;
};

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  swaps,
  guesses,
  words,
  totalHearts,
  usedSmartShuffle = false,
  ...rest
}: BasicResultsOptions & {
  swaps: number;
  guesses: string[][];
  words: string[];
  usedSmartShuffle?: boolean;
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
  const hintIndicator = usedSmartShuffle ? ' 💡' : '';

  return generateShareableResult({
    heartsSuffix: ` (${swaps} trocas${hintIndicator})`,
    totalHearts: correctTotalHearts,
    heartsSpacing: ' ',
    additionalLines: cleanUpAttempts.map((row) => row.join(' ').trim()).filter(Boolean),
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyPalavreadoEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyPalavreadoEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: SETTINGS.ROUTE,
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    swaps: state.swaps,
    guesses: state.guesses,
    words: data.words,
    usedSmartShuffle: state.usedSmartShuffle,
  });
}
