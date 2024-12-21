// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  BIGGEST_HATER: 'BIGGEST_HATER',
  MOST_LIKER: 'MOST_LIKER',
  BEST_GUESSES: 'BEST_GUESSES',
  WORST_GUESSES: 'WORST_GUESSES',
  MOST_ONE_OFFS: 'MOST_ONE_OFFS',
  MOST_EXACTS: 'MOST_EXACTS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BIGGEST_HATER]: {
    icon: 'face-angry',
    title: {
      pt: 'Maior Hater',
      en: 'Haters gonna hate',
    },
    description: {
      pt: 'N',
      en: 'Gave the most dislikes',
    },
  },
  [ACHIEVEMENTS.MOST_LIKER]: {
    icon: 'heart',
    title: {
      pt: 'Mais Liker',
      en: 'Most Liker',
    },
    description: {
      pt: 'Deu mais curtidas',
      en: 'Gave the most likes',
    },
  },
  [ACHIEVEMENTS.BEST_GUESSES]: {
    icon: 'double-arrow-up',
    title: {
      pt: 'Melhores Palpites',
      en: 'Best Guesses',
    },
    description: {
      pt: 'Teve palpites mais próximos ao número correto de curtidas',
      en: 'Had the closest guesses to the correct number of likes',
    },
  },
  [ACHIEVEMENTS.WORST_GUESSES]: {
    icon: 'double-arrow-down',
    title: {
      pt: 'Mais Pior de Ruim',
      en: 'Way Off',
    },
    description: {
      pt: 'Teve os palpites mais distantes do número correto de curtidas',
      en: 'Had the farthest guesses from the correct number of likes',
    },
  },
  [ACHIEVEMENTS.MOST_ONE_OFFS]: {
    icon: 'one',
    title: {
      pt: 'Mais Quase',
      en: 'Most One Offs',
    },
    description: {
      pt: 'Errou por pouco, um,  mais vezes',
      en: 'Guessed the most one offs',
    },
  },
  [ACHIEVEMENTS.MOST_EXACTS]: {
    icon: 'target',
    title: {
      pt: 'Mais Exatos',
      en: 'Most Exacts',
    },
    description: {
      pt: 'Acerto na mosca mais vezes',
      en: 'Guessed the exact number the most',
    },
  },
};

export default achievementsReference;
