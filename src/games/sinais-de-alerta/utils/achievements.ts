import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
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
  [ACHIEVEMENTS.MOST_DESCRIPTORS]: {
    icon: 'glasses',
    title: {
      pt: 'Mais descritivo',
      en: 'Most descriptive',
    },
    description: {
      pt: 'Acertou mais descritores',
      en: 'Guessed the most descriptors',
    },
  },
  [ACHIEVEMENTS.FEWEST_DESCRIPTORS]: {
    icon: 'face-dead',
    title: {
      pt: 'Menos descritivo',
      en: 'Least descriptive',
    },
    description: {
      pt: 'Acertou menos descritores',
      en: 'Guessed the least descriptors',
    },
  },

  [ACHIEVEMENTS.MOST_SUBJECTS]: {
    icon: 'dialog',
    title: {
      pt: 'Mais sugestivo',
      en: 'Most suggestive',
    },
    description: {
      pt: 'Acertou mais sugestões',
      en: 'Guessed the most suggestions',
    },
  },
  [ACHIEVEMENTS.FEWEST_SUBJECTS]: {
    icon: 'face-fed-up',
    title: {
      pt: 'Menos sugestivo',
      en: 'Least suggestive',
    },
    description: {
      pt: 'Acertou menos sugestões',
      en: 'Guessed the least suggestions',
    },
  },
  [ACHIEVEMENTS.TABLE_VOTES]: {
    icon: 'table',
    title: {
      pt: 'Voto de mesa',
      en: 'Table vote',
    },
    description: {
      pt: 'Votou em todas as cartas',
      en: 'Voted on all cards',
    },
  },
  [ACHIEVEMENTS.CHOOSE_FOR_ME]: {
    icon: 'dice',
    title: {
      pt: 'Chute para mim',
      en: 'Guess for me',
    },
    description: {
      pt: 'Usou a opção de chutar',
      en: 'Used the guess for me option',
    },
  },
  [ACHIEVEMENTS.BEST_DESCRIPTOR]: {
    icon: 'star',
    title: {
      pt: 'Melhor descritor',
      en: 'Best descriptor',
    },
    description: {
      pt: 'Desenhou o melhor descritor',
      en: 'Drew the best descriptor',
    },
  },
  [ACHIEVEMENTS.WORST_DESCRIPTOR]: {
    icon: 'face-oops',
    title: {
      pt: 'Pior descritor',
      en: 'Worst descriptor',
    },
    description: {
      pt: 'Desenhou o pior descritor',
      en: 'Drew the worst descriptor',
    },
  },
  [ACHIEVEMENTS.BEST_SUBJECT]: {
    icon: 'flower',
    title: {
      pt: 'Melhor sujeito',
      en: 'Best subject',
    },
    description: {
      pt: 'Desenhou o melhor sujeito',
      en: 'Drew the best subject',
    },
  },
  [ACHIEVEMENTS.WORST_SUBJECT]: {
    icon: 'face-perplexed',
    title: {
      pt: 'Pior sujeito',
      en: 'Worst subject',
    },
    description: {
      pt: 'Desenhou o pior sujeito',
      en: 'Drew the worst subject',
    },
  },
};

export default achievementsReference;
