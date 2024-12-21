// Types
import type { GamePlayer } from 'types/player';
// Utils
import { stringRemoveAccents } from 'utils/helpers';

export function countWordProperties(word: string): {
  letters: number;
  vowels: number;
  consonants: number;
  hasRepeatedVowels: boolean;
  hasRepeatedConsonants: boolean;
  consecutiveVowels: number;
  consecutiveConsonants: number;
  hasHyphen: boolean;
  numberOfWords: number;
  hasAccents: boolean;
} {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const accents = /[áéíóúãẽĩõũâêîôûàèìòùäëïöü]/;
  const cleanupWord = stringRemoveAccents(word.toLowerCase());

  let letters = 0;
  let vowelsCount = 0;
  let consonantsCount = 0;
  let hasRepeatedVowels = false;
  let hasRepeatedConsonants = false;
  let maxConsecutiveVowels = 0;
  let maxConsecutiveConsonants = 0;
  let consecutiveVowels = 0;
  let consecutiveConsonants = 0;
  const hasHyphen = word.includes('-');
  const numberOfWords = word.split(' ').length;
  const hasAccents = accents.test(word);

  for (let i = 0; i < cleanupWord.length; i++) {
    const char = cleanupWord[i];
    if (/[a-zA-Z]/.test(char)) {
      letters++;
      if (vowels.includes(char)) {
        vowelsCount++;
        consecutiveVowels++;
        consecutiveConsonants = 0;
      } else if (consonants.includes(char)) {
        consonantsCount++;
        consecutiveConsonants++;
        consecutiveVowels = 0;
      }
    }
    if (consecutiveVowels > maxConsecutiveVowels) {
      maxConsecutiveVowels = consecutiveVowels;
    }
    if (consecutiveConsonants > maxConsecutiveConsonants) {
      maxConsecutiveConsonants = consecutiveConsonants;
    }
  }

  const vowelsDict: Dictionary<boolean> = {};
  const consonantsDict: Dictionary<boolean> = {};
  for (let i = 0; i < cleanupWord.length; i++) {
    const char = cleanupWord[i];
    if (/[a-zA-Z]/.test(char)) {
      if (vowels.includes(char)) {
        if (vowelsDict[char]) {
          hasRepeatedVowels = true;
        } else {
          vowelsDict[char] = true;
        }
      } else if (consonants.includes(char)) {
        if (consonantsDict[char]) {
          hasRepeatedConsonants = true;
        } else {
          consonantsDict[char] = true;
        }
      }
    }
  }

  return {
    letters,
    vowels: vowelsCount,
    consonants: consonantsCount,
    hasRepeatedVowels,
    hasRepeatedConsonants,
    consecutiveVowels: maxConsecutiveVowels > 1 ? maxConsecutiveVowels : 0,
    consecutiveConsonants: maxConsecutiveConsonants > 1 ? maxConsecutiveConsonants : 0,
    hasHyphen,
    numberOfWords,
    hasAccents,
  };
}

export const getPlayerItemsLeft = (player: GamePlayer) => `(${player?.hand?.length ?? 0})`;
