// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  BEST_WORDS: 'BEST_WORDS',
  WORST_WORDS: 'WORST_WORDS',
  MOST_TWO_CORRECT_GUESSES: 'MOST_TWO_CORRECT_GUESSES',
  FEWEST_TWO_CORRECT_GUESSES: 'FEWEST_TWO_CORRECT_GUESSES',
  MOST_ONE_CORRECT_GUESSES: 'MOST_ONE_CORRECT_GUESSES',
  FEWEST_ONE_CORRECT_GUESSES: 'FEWEST_ONE_CORRECT_GUESSES',
  MOST_ZERO_CORRECT_GUESSES: 'MOST_ZERO_CORRECT_GUESSES',
  FEWEST_ZERO_CORRECT_GUESSES: 'FEWEST_ZERO_CORRECT_GUESSES',
  LONGEST_WORDS: 'LONGEST_WORDS',
  SHORTEST_WORDS: 'SHORTEST_WORDS',
} as const;

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BEST_WORDS]: {
    icon: 'star',
    title: {
      pt: 'Melhore Palavras',
      en: 'Best Words',
    },
    description: {
      pt: 'Teve a melhor média de palpites corretos em suas palavras',
      en: 'Had the best average of correct guesses in their words',
    },
  },
  [ACHIEVEMENTS.WORST_WORDS]: {
    icon: 'poop',
    title: {
      pt: 'Piores Palavras',
      en: 'Worst Words',
    },
    description: {
      pt: 'Teve a pior média de palpites corretos em suas palavras',
      en: 'Had the worst average of correct guesses in their words',
    },
  },
  [ACHIEVEMENTS.MOST_TWO_CORRECT_GUESSES]: {
    icon: 'two',
    title: {
      pt: 'Mais Preciso',
      en: 'Most Accurate',
    },
    description: {
      pt: 'Teve o maior número de palavras com dois palpites corretos',
      en: 'Had the most words with two correct guesses',
    },
  },
  [ACHIEVEMENTS.FEWEST_TWO_CORRECT_GUESSES]: {
    icon: 'two',
    title: {
      pt: 'Menos Preciso',
      en: 'Least Accurate',
    },
    description: {
      pt: 'Teve o menor número de palavras com dois palpites corretos',
      en: 'Had the least words with two correct guesses',
    },
  },
  [ACHIEVEMENTS.MOST_ONE_CORRECT_GUESSES]: {
    icon: 'one',
    title: {
      pt: 'Mais Sortudo',
      en: 'Most Lucky',
    },
    description: {
      pt: 'Teve o maior número de palavras com um palpite correto',
      en: 'Had the most words with one correct guess',
    },
  },
  [ACHIEVEMENTS.FEWEST_ONE_CORRECT_GUESSES]: {
    icon: 'one',
    title: {
      pt: 'Menos Sortudo',
      en: 'Least Lucky',
    },
    description: {
      pt: 'Teve o menor número de palavras com um palpite correto',
      en: 'Had the least words with one correct guess',
    },
  },
  [ACHIEVEMENTS.MOST_ZERO_CORRECT_GUESSES]: {
    icon: 'zero',
    title: {
      pt: 'Mais Desafiador',
      en: 'Most Challenging',
    },
    description: {
      pt: 'Teve o maior número de palavras sem palpites corretos',
      en: 'Had the most words with zero correct guesses',
    },
  },
  [ACHIEVEMENTS.FEWEST_ZERO_CORRECT_GUESSES]: {
    icon: 'zero',
    title: {
      pt: 'Menos Desafiador',
      en: 'Least Challenging',
    },
    description: {
      pt: 'Teve o menor número de palavras sem palpites corretos',
      en: 'Had the least words with zero correct guesses',
    },
  },
  [ACHIEVEMENTS.LONGEST_WORDS]: {
    icon: 'long',
    title: {
      pt: 'Mais Criativo',
      en: 'Most Creative',
    },
    description: {
      pt: 'Criou as palavras mais longas',
      en: 'Created the longest words',
    },
  },
  [ACHIEVEMENTS.SHORTEST_WORDS]: {
    icon: 'short',
    title: {
      pt: 'Mais Direto',
      en: 'Most Direct',
    },
    description: {
      pt: 'Criou as palavras mais curtas',
      en: 'Created the shortest words',
    },
  },
};

export default achievementsReference;
