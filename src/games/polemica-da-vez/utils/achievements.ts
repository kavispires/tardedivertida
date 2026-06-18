// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_ONE_OFFS: {
    id: 'MOST_ONE_OFFS',
    doc: 'Number of guesses that are off by one from the actual number of likes',
    icon: 'one',
    title: {
      en: 'Most One Offs',
      pt: 'Mais Quase',
    },
    description: {
      en: 'Guessed the most one offs',
      pt: 'Errou por pouco, um,  mais vezes',
    },
  },
  MOST_EXACTS: {
    id: 'MOST_EXACTS',
    doc: 'Number of guesses that are exactly the number of likes',
    icon: 'target',
    title: {
      en: 'Most Exacts',
      pt: 'Mais Exatos',
    },
    description: {
      en: 'Guessed the exact number the most',
      pt: 'Acerto na mosca mais vezes',
    },
  },
  BEST_GUESSES: {
    id: 'BEST_GUESSES',
    doc: 'Distance between the guessed and actual number of likes',
    icon: 'double-arrow-up',
    title: {
      en: 'Best Guesses',
      pt: 'Melhores Palpites',
    },
    description: {
      en: 'Had the closest guesses to the correct number of likes',
      pt: 'Teve palpites mais próximos ao número correto de curtidas',
    },
  },
  WORST_GUESSES: {
    id: 'WORST_GUESSES',
    doc: 'Distance between the guessed and actual number of likes',
    icon: 'double-arrow-down',
    title: {
      en: 'Way Off',
      pt: 'Mais Pior de Ruim',
    },
    description: {
      en: 'Had the farthest guesses from the correct number of likes',
      pt: 'Teve os palpites mais distantes do número correto de curtidas',
    },
  },
  BIGGEST_HATER: {
    id: 'BIGGEST_HATER',
    doc: 'How many things were liked by the player',
    icon: 'face-angry',
    title: {
      en: 'Haters gonna hate',
      pt: 'Maior Hater',
    },
    description: {
      en: 'Gave the most dislikes',
      pt: 'N',
    },
  },
  MOST_LIKER: {
    id: 'MOST_LIKER',
    doc: 'How many things were liked by the player',
    icon: 'heart',
    title: {
      en: 'Most Liker',
      pt: 'Mais Liker',
    },
    description: {
      en: 'Gave the most likes',
      pt: 'Deu mais curtidas',
    },
  },
};

export default achievementsReference;
