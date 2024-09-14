// Types
import { AchievementReference } from 'types/achievements';

export const achievementsReference: AchievementReference = {
  BRAVEST: {
    icon: 'sword',
    title: {
      pt: 'Mais Corajoso',
      en: 'Bravest',
    },
    description: {
      pt: 'Encontrou o maior número de monstros',
      en: 'Encounter the most number of monsters',
    },
  },
  LUCKIEST: {
    icon: 'clover',
    title: {
      pt: 'Mais Sortudo',
      en: 'Luckiest',
    },
    description: {
      pt: 'Encontrou o menor número de monstros',
      en: 'Encounter the fewest monsters',
    },
  },
  CANDY_LOSER: {
    icon: 'foot-prints',
    title: {
      pt: 'Mais Desesperado',
      en: 'Most Desperate',
    },
    description: {
      pt: 'Perdeu mais doces para ataques dos monstros',
      en: 'Lost the most number of candy for a double monster',
    },
  },
  MOST_SCARED: {
    icon: 'face-scared',
    title: {
      pt: 'Mais Assustado',
      en: 'Most Scared',
    },
    description: {
      pt: 'Visitou o menor número de casas',
      en: 'Visited the fewest houses',
    },
  },
  MOST_HOUSES: {
    icon: 'house',
    title: {
      pt: 'Mais Andador',
      en: 'Most Houses',
    },
    description: {
      pt: 'Visitou o maior número de casas',
      en: 'Visited the most houses',
    },
  },
  MOST_JACKPOTS: {
    icon: 'dollar',
    title: {
      pt: 'Mais Boladas',
      en: 'Most Jackpots',
    },
    description: {
      pt: 'Ganhou mais boladas',
      en: 'Got the most jackpots',
    },
  },
  MOST_SIDEWALK: {
    icon: 'candy',
    title: {
      pt: 'Mais Mendigo',
      en: 'Most Sidewalk Candy',
    },
    description: {
      pt: 'Catou mais doces da calçada',
      en: 'Got the most candy from the sidewalk',
    },
  },
};

export default achievementsReference;
