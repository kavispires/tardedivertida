// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  BEST_WORDS: {
    id: 'BEST_WORDS',
    doc: 'Quality scores of submitted words',
    icon: 'open-book',
    title: {
      en: 'Best Words',
      pt: 'Melhores Palavras',
    },
    description: {
      en: 'Had the best average of correct guesses in their words',
      pt: 'Teve a melhor média de palpites corretos em suas palavras',
    },
  },
  WORST_WORDS: {
    id: 'WORST_WORDS',
    doc: 'Quality scores of submitted words',
    icon: 'face-oops',
    title: {
      en: 'Most obscure words',
      pt: 'Palavras Mais Obscuras',
    },
    description: {
      en: 'Had the worst average of correct guesses in their words',
      pt: 'Teve a pior média de palpites corretos em suas palavras',
    },
  },
  FEWEST_ONE_CORRECT_GUESSES: {
    id: 'FEWEST_ONE_CORRECT_GUESSES',
    doc: 'Number of times player guessed one word correctly',
    icon: 'one-silver',
    title: {
      en: 'Least Lucky',
      pt: 'Menos Sortudo',
    },
    description: {
      en: 'Had the least words with one correct guess',
      pt: 'Teve o menor número de palavras com um palpite correto',
    },
  },
  MOST_ONE_CORRECT_GUESSES: {
    id: 'MOST_ONE_CORRECT_GUESSES',
    doc: 'Number of times player guessed one word correctly',
    icon: 'one',
    title: {
      en: 'Most Lucky',
      pt: 'Mais Sortudo',
    },
    description: {
      en: 'Had the most words with one correct guess',
      pt: 'Teve o maior número de palavras com um palpite correto',
    },
  },
  FEWEST_TWO_CORRECT_GUESSES: {
    id: 'FEWEST_TWO_CORRECT_GUESSES',
    doc: 'Number of times player guessed both words correctly',
    icon: 'two-silver',
    title: {
      en: 'Least Accurate',
      pt: 'Menos Preciso',
    },
    description: {
      en: 'Had the least words with two correct guesses',
      pt: 'Teve o menor número de palavras com dois palpites corretos',
    },
  },
  MOST_TWO_CORRECT_GUESSES: {
    id: 'MOST_TWO_CORRECT_GUESSES',
    doc: 'Number of times player guessed both words correctly',
    icon: 'two',
    title: {
      en: 'Most Accurate',
      pt: 'Mais Preciso',
    },
    description: {
      en: 'Had the most words with two correct guesses',
      pt: 'Teve o maior número de palavras com dois palpites corretos',
    },
  },
  LONGEST_WORDS: {
    id: 'LONGEST_WORDS',
    doc: 'Total word lengths across all submitted words',
    icon: 'arrow-wide',
    title: {
      en: 'Most Creative',
      pt: 'Mais Criativo',
    },
    description: {
      en: 'Created the longest words',
      pt: 'Criou as palavras mais longas',
    },
  },
  SHORTEST_WORDS: {
    id: 'SHORTEST_WORDS',
    doc: 'Total word lengths across all submitted words',
    icon: 'arrow-narrow',
    title: {
      en: 'Most Direct',
      pt: 'Mais Direto',
    },
    description: {
      en: 'Created the shortest words',
      pt: 'Criou as palavras mais curtas',
    },
  },
  FEWEST_ZERO_CORRECT_GUESSES: {
    id: 'FEWEST_ZERO_CORRECT_GUESSES',
    doc: 'Number of times player guessed no words correctly',
    icon: 'zero',
    title: {
      en: 'Least Challenging',
      pt: 'Menos Desafiador',
    },
    description: {
      en: 'Had the least words with zero correct guesses',
      pt: 'Teve o menor número de palavras sem palpites corretos',
    },
  },
  MOST_ZERO_CORRECT_GUESSES: {
    id: 'MOST_ZERO_CORRECT_GUESSES',
    doc: 'Number of times player guessed no words correctly',
    icon: 'zero',
    title: {
      en: 'Most Challenging',
      pt: 'Mais Desafiador',
    },
    description: {
      en: 'Had the most words with zero correct guesses',
      pt: 'Teve o maior número de palavras sem palpites corretos',
    },
  },
};

export default achievementsReference;
