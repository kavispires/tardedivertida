// Types
import type { AchievementReference } from 'types/achievements';

export const DETETIVES_IMAGINATIVOS_ACHIEVEMENTS = {
  MOST_LEADER: 'MOST_LEADER',
  MOST_IMPOSTOR: 'MOST_IMPOSTOR',
  LONGEST_DEFENSE: 'LONGEST_DEFENSE',
  SHORTEST_DEFENSE: 'SHORTEST_DEFENSE',
  VOTED_FOR_IMPOSTOR: 'VOTED_FOR_IMPOSTOR',
  VOTED_FOR_INNOCENT: 'VOTED_FOR_INNOCENT',
  RECEIVED_VOTES: 'RECEIVED_VOTES',
  LONGEST_CLUES: 'LONGEST_CLUES',
  SHORTEST_CLUES: 'SHORTEST_CLUES',
} as const;

export const achievementsReference: AchievementReference = {
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.MOST_LEADER]: {
    icon: 'glasses',
    title: {
      pt: 'Líder Mais Vezes',
      en: 'Most Leader',
    },
    description: {
      pt: 'Foi líder mais vezes',
      en: 'Was leader the most times',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.MOST_IMPOSTOR]: {
    icon: 'mask',
    title: {
      pt: 'Impostor Mais Vezes',
      en: 'Most Impostor',
    },
    description: {
      pt: 'Foi impostor mais vezes',
      en: 'Was impostor the most times',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.LONGEST_DEFENSE]: {
    icon: 'snail',
    title: {
      pt: 'Defesa Mais Longa',
      en: 'Longest Defense',
    },
    description: {
      pt: 'Demorou mais tempo para se defender',
      en: 'Took the longest to defend',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.SHORTEST_DEFENSE]: {
    icon: 'stopwatch',
    title: {
      pt: 'Defesa Mais Curta',
      en: 'Shortest Defense',
    },
    description: {
      pt: 'Demorou menos tempo para se defender',
      en: 'Took the shortest to defend',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.VOTED_FOR_IMPOSTOR]: {
    icon: 'eye',
    title: {
      pt: 'Votou no Impostor',
      en: 'Voted for Impostor',
    },
    description: {
      pt: 'Votou no impostor mais vezes',
      en: 'Voted for the impostor the most times',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.VOTED_FOR_INNOCENT]: {
    icon: 'broken-heart',
    title: {
      pt: 'Votou no Inocente',
      en: 'Voted for Innocent',
    },
    description: {
      pt: 'Votou em inocentes mais vezes',
      en: 'Voted for innocents the most times',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.RECEIVED_VOTES]: {
    icon: 'plus',
    title: {
      pt: 'Mais atacado',
      en: 'Most Attacked',
    },
    description: {
      pt: 'Recebeu mais votos quando não era o impostor',
      en: 'Received the most votes when not being the impostor',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.LONGEST_CLUES]: {
    icon: 'pencil',
    title: {
      pt: 'Dicas Mais Longas',
      en: 'Longest Clues',
    },
    description: {
      pt: 'Usou dicas mais longas',
      en: 'Used the longest clues',
    },
  },
  [DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.SHORTEST_CLUES]: {
    icon: 'broken-pencil',
    title: {
      pt: 'Dicas Mais Curtas',
      en: 'Shortest Clues',
    },
    description: {
      pt: 'Usou dicas mais curtas',
      en: 'Used the shortest clues',
    },
  },
};

export default achievementsReference;
