import { cloneDeep, shuffle } from 'lodash';
// Internal
import type { BoardEntry, GuessedPair } from './types';

export function mockGuesses(guessedPairs: Dictionary<GuessedPair>, board: BoardEntry[], userId: string) {
  const copy = cloneDeep(guessedPairs);

  let unusedIds: string[] = [];
  // Perform correct guesses (80% of chance)
  Object.values(copy).forEach((pairGuess) => {
    if (pairGuess.playerId === userId) {
      // Skip mocking for the current user
      return;
    }
    pairGuess.guesses = [];
    pairGuess.ids.forEach((id) => {
      if (Math.random() < 0.7) {
        // 70% chance to guess correctly
        pairGuess.guesses.push(id);
      } else {
        // Collect unused ids for wrong guesses
        unusedIds.push(id);
      }
    });
  });

  unusedIds = shuffle(unusedIds);
  // Define the final item (70% of chance)
  const finalItem = board.find((entry) => entry.playerId === 'TARGET')?.id;
  if (finalItem && Math.random() > 0.7) {
    unusedIds.push(finalItem);
  }

  // Distribute missing items as wrong guesses
  Object.values(copy).forEach((pairGuess) => {
    if (pairGuess.guesses.length === 0) {
      const popped = unusedIds.pop();
      if (popped) {
        pairGuess.guesses.push(popped);
      }
    }
    if (pairGuess.guesses.length === 1) {
      const popped = unusedIds.pop();
      if (popped) {
        pairGuess.guesses.push(popped);
      }
    }
  });

  return copy;
}
