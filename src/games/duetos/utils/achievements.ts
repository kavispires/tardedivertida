// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_ALONE: {
    id: 'MOST_ALONE',
    doc: 'Times having no matches with any player',
    icon: 'glasses',
    title: {
      en: 'Individualist',
      pt: 'Individualista',
    },
    description: {
      en: 'Your pairs did not match with anyone else the most',
      pt: 'Seus pares não deram match com ninguém mais vezes',
    },
  },
  MOST_DUOS: {
    id: 'MOST_DUOS',
    doc: 'Times pairing with exactly one other player',
    icon: 'puzzle',
    title: {
      en: 'Most Duos',
      pt: 'Mais Duplas',
    },
    description: {
      en: 'Matched with only one other player the most',
      pt: 'Deu match com apenas um outro jogador mais vezes',
    },
  },
  MOST_GROUPS: {
    id: 'MOST_GROUPS',
    doc: 'Times pairing with more than one other player',
    icon: 'intersection',
    title: {
      en: 'Best Guesser',
      pt: 'Melhor Adivinhador',
    },
    description: {
      en: 'Matched with several people the most',
      pt: 'Deu match com várias pessoas mais vezes',
    },
  },
  MOST_LEFT_OUT: {
    id: 'MOST_LEFT_OUT',
    doc: 'Times being left out while others paired',
    icon: 'x',
    title: {
      en: 'Separatist',
      pt: 'Separatista',
    },
    description: {
      en: 'Guessed the leftover item the most',
      pt: 'Acertou o item de sobra mais vezes',
    },
  },
};

export default achievementsReference;
