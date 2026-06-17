// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_LEADER: {
    id: 'MOST_LEADER',
    doc: 'Points earned as the leader/artist',
    icon: 'glasses',
    title: {
      en: 'Most Leader',
      pt: 'Líder Mais Vezes',
    },
    description: {
      en: 'Was leader the most times',
      pt: 'Foi líder mais vezes',
    },
  },
  LONGEST_CLUES: {
    id: 'LONGEST_CLUES',
    doc: 'Total length of clues given',
    icon: 'pencil',
    title: {
      en: 'Longest Clues',
      pt: 'Dicas Mais Longas',
    },
    description: {
      en: 'Used the longest clues',
      pt: 'Usou dicas mais longas',
    },
  },
  SHORTEST_CLUES: {
    id: 'SHORTEST_CLUES',
    doc: 'Total length of clues given',
    icon: 'broken-pencil',
    title: {
      en: 'Shortest Clues',
      pt: 'Dicas Mais Curtas',
    },
    description: {
      en: 'Used the shortest clues',
      pt: 'Usou dicas mais curtas',
    },
  },
  LONGEST_DEFENSE: {
    id: 'LONGEST_DEFENSE',
    doc: 'Total time spent defending',
    icon: 'snail',
    title: {
      en: 'Longest Defense',
      pt: 'Defesa Mais Longa',
    },
    description: {
      en: 'Took the longest to defend',
      pt: 'Demorou mais tempo para se defender',
    },
  },
  SHORTEST_DEFENSE: {
    id: 'SHORTEST_DEFENSE',
    doc: 'Total time spent defending',
    icon: 'stopwatch',
    title: {
      en: 'Shortest Defense',
      pt: 'Defesa Mais Curta',
    },
    description: {
      en: 'Took the shortest to defend',
      pt: 'Demorou menos tempo para se defender',
    },
  },
  MOST_IMPOSTOR: {
    id: 'MOST_IMPOSTOR',
    doc: 'Points earned as the impostor',
    icon: 'mask',
    title: {
      en: 'Most Impostor',
      pt: 'Impostor Mais Vezes',
    },
    description: {
      en: 'Was impostor the most times',
      pt: 'Foi impostor mais vezes',
    },
  },
  RECEIVED_VOTES: {
    id: 'RECEIVED_VOTES',
    doc: 'Votes received from other players',
    icon: 'plus',
    title: {
      en: 'Most Attacked',
      pt: 'Mais atacado',
    },
    description: {
      en: 'Received the most votes when not being the impostor',
      pt: 'Recebeu mais votos quando não era o impostor',
    },
  },
  VOTED_FOR_IMPOSTOR: {
    id: 'VOTED_FOR_IMPOSTOR',
    doc: 'Times voting for the impostor',
    icon: 'eye',
    title: {
      en: 'Voted for Impostor',
      pt: 'Votou no Impostor',
    },
    description: {
      en: 'Voted for the impostor the most times',
      pt: 'Votou no impostor mais vezes',
    },
  },
  VOTED_FOR_INNOCENT: {
    id: 'VOTED_FOR_INNOCENT',
    doc: 'Times voting for innocent players',
    icon: 'broken-heart',
    title: {
      en: 'Voted for Innocent',
      pt: 'Votou no Inocente',
    },
    description: {
      en: 'Voted for innocents the most times',
      pt: 'Votou em inocentes mais vezes',
    },
  },
};

export default achievementsReference;
