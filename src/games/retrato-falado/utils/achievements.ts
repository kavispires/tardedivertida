import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  BEST_SKETCHES: 'BEST_SKETCHES',
  WORST_SKETCHES: 'WORST_SKETCHES',
  MOST_GROUP_VOTES: 'MOST_GROUP_VOTES',
  FEWEST_GROUP_VOTES: 'FEWEST_GROUP_VOTES',
  WITNESS_PICK: 'WITNESS_PICK',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BEST_SKETCHES]: {
    icon: 'paint-brush',
    title: {
      en: 'Best Sketch Artist',
      pt: 'Melhor Desenhista',
    },
    description: {
      pt: 'Ganhou mais votos durante o jogo',
      en: 'Got the most votes during the game',
    },
  },
  [ACHIEVEMENTS.WORST_SKETCHES]: {
    icon: 'broken-pencil',
    title: {
      en: 'Intern Sketch Artist',
      pt: 'Desenhista Estagiário',
    },
    description: {
      pt: 'Ganhou menos votos durante o jogo',
      en: 'Got the fewest votes during the game',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_VOTES]: {
    icon: 'people',
    title: {
      en: 'Best Consensus',
      pt: 'Melhor Senso Comum',
    },
    description: {
      pt: 'Votou no desenho mais votado mais vezes',
      en: 'Voted for the most voted sketch the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_GROUP_VOTES]: {
    icon: 'difference',
    title: {
      en: 'Outside of the box Thinker',
      pt: 'Diferentão',
    },
    description: {
      pt: 'Votou no desenho mais votado menos vezes',
      en: 'Voted for the most voted sketch the fewest times',
    },
  },
  [ACHIEVEMENTS.WITNESS_PICK]: {
    icon: 'eye',
    title: {
      en: 'Witness Pick',
      pt: 'Escolha do Testemunha',
    },
    description: {
      pt: 'Foi escolhido pelo testemunha mais vezes',
      en: 'Was picked by the witness the most times',
    },
  },
};

export default achievementsReference;
