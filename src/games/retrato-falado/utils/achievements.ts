// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_GROUP_VOTES: {
    id: 'FEWEST_GROUP_VOTES',
    doc: 'total number of group votes received',
    icon: 'difference',
    title: {
      en: 'Outside of the box Thinker',
      pt: 'Diferentão',
    },
    description: {
      en: 'Voted for the most voted sketch the fewest times',
      pt: 'Votou no desenho mais votado menos vezes',
    },
  },
  MOST_GROUP_VOTES: {
    id: 'MOST_GROUP_VOTES',
    doc: 'total number of group votes received',
    icon: 'people',
    title: {
      en: 'Best Consensus',
      pt: 'Melhor Senso Comum',
    },
    description: {
      en: 'Voted for the most voted sketch the most times',
      pt: 'Votou no desenho mais votado mais vezes',
    },
  },
  BEST_SKETCHES: {
    id: 'BEST_SKETCHES',
    doc: 'total number of votes received',
    icon: 'paint-brush',
    title: {
      en: 'Best Sketch Artist',
      pt: 'Melhor Desenhista',
    },
    description: {
      en: 'Got the most votes during the game',
      pt: 'Ganhou mais votos durante o jogo',
    },
  },
  WORST_SKETCHES: {
    id: 'WORST_SKETCHES',
    doc: 'total number of votes received',
    icon: 'broken-pencil',
    title: {
      en: 'Intern Sketch Artist',
      pt: 'Desenhista Estagiário',
    },
    description: {
      en: 'Got the fewest votes during the game',
      pt: 'Ganhou menos votos durante o jogo',
    },
  },
  WITNESS_PICK: {
    id: 'WITNESS_PICK',
    doc: 'total number of times a player was picked by the witness',
    icon: 'eye',
    title: {
      en: 'Witness Pick',
      pt: 'Escolha do Testemunha',
    },
    description: {
      en: 'Was picked by the witness the most times',
      pt: 'Foi escolhido pelo testemunha mais vezes',
    },
  },
};

export default achievementsReference;
