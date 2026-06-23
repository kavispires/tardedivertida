import { shuffle } from 'lodash';
// Ant Design Resources
import { HeartFilled, MoonFilled, StarFilled, SunFilled } from '@ant-design/icons';
// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
// Internal
import type { GuessedPair } from './types';

export const PAIR_ICONS = shuffle([
  <MoonFilled key="moon" />,
  <SunFilled key="sun" />,
  <HeartFilled key="heart" />,
  <StarFilled key="star" />,
]);

export const PAIR_COLORS = shuffle(['#FF6B6B', '#4ECDC4', '#FFD93D', '#1A535C']);

export const getTitleForRound = (round: GameRound) => {
  switch (round.current) {
    case 1: {
      return (
        <Translate
          pt="Loja de Decoração"
          en="Decoration Store"
        />
      );
    }
    case 2: {
      return (
        <Translate
          pt="Viveiro de Plantas"
          en="Plant Nursery"
        />
      );
    }
    case 3: {
      return (
        <Translate
          pt="Loja de Animais"
          en="Pet Shop"
        />
      );
    }
    default: {
      return (
        <Translate
          pt="Loja de Coisas"
          en="Thing Store"
        />
      );
    }
  }
};

/**
 * Parses guessed pairs and returns a dictionary of guesses excluding the current user's guesses.
 *
 * @param guessedPairs - A dictionary of guessed pairs where keys are pair IDs and values are GuessedPair objects
 * @param userId - The ID of the current user whose guesses should be excluded from the result
 * @returns A dictionary where keys are pair IDs and values are arrays of guesses (strings)
 */
export const parseGuesses = (guessedPairs: Dictionary<GuessedPair>, userId: string): Dictionary<string[]> => {
  return Object.values(guessedPairs).reduce((acc: Dictionary<string[]>, pair) => {
    if (pair.playerId === userId) return acc; // Skip current user's guesses
    acc[pair.id] = pair.guesses;
    return acc;
  }, {});
};
