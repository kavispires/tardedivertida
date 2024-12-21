// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_ELIMINATED_CLUES: 'MOST_ELIMINATED_CLUES',
  FEWEST_ELIMINATED_CLUES: 'FEWEST_ELIMINATED_CLUES',
  LONGEST_CLUES: 'LONGEST_CLUES',
  SHORTEST_CLUES: 'SHORTEST_CLUES',
  MOST_PASSES: 'MOST_PASSES',
  BEST_GUESSER: 'BEST_GUESSER',
  WORST_GUESSER: 'WORST_GUESSER',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_ELIMINATED_CLUES]: {
    icon: 'people',
    title: {
      pt: 'Melhor Senso Comum',
      en: 'Best Common Sense',
    },
    description: {
      pt: 'Teve dicas eliminadas mais vezes',
      en: 'Got their clues to be eliminated the most',
    },
  },
  [ACHIEVEMENTS.FEWEST_ELIMINATED_CLUES]: {
    icon: 'check-mark',
    title: {
      pt: 'Mais Sábio',
      en: 'Wisest',
    },
    description: {
      pt: 'Teve dicas eliminadas menos vezes',
      en: 'Got their clues to be eliminated the fewest',
    },
  },
  [ACHIEVEMENTS.LONGEST_CLUES]: {
    icon: 'arrow-wide',
    title: {
      pt: 'Melhor Digitador',
      en: 'Best typer',
    },
    description: {
      pt: 'Teve as dicas mais longas',
      en: 'Had the lengthiest clues',
    },
  },
  [ACHIEVEMENTS.SHORTEST_CLUES]: {
    icon: 'arrow-narrow',
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Teve as dicas mais curtas',
      en: 'Had the shortest clues',
    },
  },
  [ACHIEVEMENTS.MOST_PASSES]: {
    icon: 'face-panic',
    title: {
      pt: 'Mais Medroso',
      en: 'Most Scared',
    },
    description: {
      pt: 'Passou mais vezes',
      en: 'Pressed pass the most',
    },
  },
  [ACHIEVEMENTS.BEST_GUESSER]: {
    icon: 'brain',
    title: {
      pt: 'Melhor Adivinhador',
      en: 'Best Guesser',
    },
    description: {
      pt: 'Adivinhou com o menor número médio de dicas',
      en: 'Guessed correctly with the fewest average number of clues',
    },
  },
  [ACHIEVEMENTS.WORST_GUESSER]: {
    icon: 'broken-bulb',
    title: {
      pt: 'Mais Audacioso',
      en: 'Most Wild Guesser',
    },
    description: {
      pt: 'Errou com o maior número médio de dicas',
      en: 'Guessed wrong with the most average number of clues',
    },
  },
};

export default achievementsReference;
