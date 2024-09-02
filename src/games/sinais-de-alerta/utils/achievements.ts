import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_ALONE: 'MOST_ALONE',
  MOST_DUOS: 'MOST_DUOS',
  MOST_GROUPS: 'MOST_GROUPS',
  MOST_LEFT_OUT: 'MOST_LEFT_OUT',

  MOST_DESCRIPTORS: 'MOST_DESCRIPTORS',
  FEWEST_DESCRIPTORS: 'FEWEST_DESCRIPTORS',
  MOST_SUBJECTS: 'MOST_SUBJECTS',
  FEWEST_SUBJECTS: 'FEWEST_SUBJECTS',
  TABLE_VOTES: 'TABLE_VOTES',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
  BEST_DESCRIPTOR: 'BEST_DESCRIPTOR',
  WORST_DESCRIPTOR: 'WORST_DESCRIPTOR',
  BEST_SUBJECT: 'BEST_SUBJECT',
  WORST_SUBJECT: 'WORST_SUBJECT',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_ALONE]: {
    icon: 'glasses',
    title: {
      pt: 'Individualista',
      en: 'Individualist',
    },
    description: {
      pt: 'Seus pares não deram match com ninguém mais vezes',
      en: 'Your pairs did not match with anyone else the most',
    },
  },
  [ACHIEVEMENTS.MOST_DUOS]: {
    icon: 'puzzle',
    title: {
      pt: 'Mais Duplas',
      en: 'Most Duos',
    },
    description: {
      pt: 'Deu match com apenas um outro jogador mais vezes',
      en: 'Matched with only one other player the most',
    },
  },
  [ACHIEVEMENTS.MOST_GROUPS]: {
    icon: 'intersection',
    title: {
      pt: 'Melhor Adivinhador',
      en: 'Best Guesser',
    },
    description: {
      pt: 'Deu match com várias pessoas mais vezes',
      en: 'Matched with several people the most',
    },
  },
  [ACHIEVEMENTS.MOST_LEFT_OUT]: {
    icon: 'x',
    title: {
      pt: 'Separatista',
      en: 'Separatist',
    },
    description: {
      pt: 'Acertou o item de sobra mais vezes',
      en: 'Guessed the leftover item the most',
    },
  },
};

export default achievementsReference;
