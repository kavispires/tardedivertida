// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  BRAVEST: 'BRAVEST',
  LUCKIEST: 'LUCKIEST',
  CANDY_LOSER: 'CANDY_LOSER',
  MOST_SCARED: 'MOST_SCARED',
  MOST_HOUSES: 'MOST_HOUSES',
  MOST_JACKPOTS: 'MOST_JACKPOTS',
  MOST_SIDEWALK: 'MOST_SIDEWALK',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BRAVEST]: {
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
  [ACHIEVEMENTS.LUCKIEST]: {
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
  [ACHIEVEMENTS.CANDY_LOSER]: {
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
  [ACHIEVEMENTS.MOST_SCARED]: {
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
  [ACHIEVEMENTS.MOST_HOUSES]: {
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
  [ACHIEVEMENTS.MOST_JACKPOTS]: {
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
  [ACHIEVEMENTS.MOST_SIDEWALK]: {
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
