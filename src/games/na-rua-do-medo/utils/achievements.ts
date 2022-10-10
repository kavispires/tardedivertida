import { MedalCandyIcon } from 'components/icons/MedalCandyIcon';
import { MedalCloverIcon } from 'components/icons/MedalCloverIcon';
import { MedalDollarSignIcon } from 'components/icons/MedalDollarSignIcon';
import { MedalHouseIcon } from 'components/icons/MedalHouseIcon';
import { MedalScaredIcon } from 'components/icons/MedalScaredIcon';
import { MedalSwordIcon } from 'components/icons/MedalSwordIcon';
import { MedalWideIcon } from 'components/icons/MedalWideIcon';

export const achievementsReference: AchievementReference = {
  BRAVEST: {
    Icon: MedalSwordIcon,
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
    Icon: MedalCloverIcon,
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
    Icon: MedalCandyIcon,
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
    Icon: MedalScaredIcon,
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
    Icon: MedalHouseIcon,
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
    Icon: MedalDollarSignIcon,
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
    Icon: MedalWideIcon,
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
