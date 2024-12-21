// Types
import type { AchievementReference } from 'types/achievements';

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
      pt: 'Menos descritivos',
      en: 'Fewest descriptors',
    },
    description: {
      pt: 'Acertou menos descritores',
      en: 'Guessed the least descriptors',
    },
  },
  [ACHIEVEMENTS.MOST_SUBJECTS]: {
    icon: 'dialog',
    title: {
      pt: 'Mais sujeitos',
      en: 'Most subjects',
    },
    description: {
      pt: 'Acertou mais sujeitos',
      en: 'Guessed the most subjects',
    },
  },
  [ACHIEVEMENTS.FEWEST_SUBJECTS]: {
    icon: 'face-fed-up',
    title: {
      pt: 'Menos sujeitos',
      en: 'Fewest subjects',
    },
    description: {
      pt: 'Acertou menos sujeitos',
      en: 'Guessed the least subjects',
    },
  },
  [ACHIEVEMENTS.TABLE_VOTES]: {
    icon: 'table',
    title: {
      pt: 'Voto no extra',
      en: 'Table vote',
    },
    description: {
      pt: 'Votou em cartas que não era de jogadores mais vezes',
      en: 'Voted on non-player cards more times',
    },
  },
  [ACHIEVEMENTS.CHOOSE_FOR_ME]: {
    icon: 'dice',
    title: {
      pt: 'Chute para mim',
      en: 'Guess for me',
    },
    description: {
      pt: 'Usou a opção de chutar mais vezes',
      en: 'Used the guess for me option the most',
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
      pt: 'Descritor menos habilidoso',
      en: 'Not so skilled descriptor',
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
      pt: 'Sujeito mais mais ou menos',
      en: 'Not so skilled subject',
    },
    description: {
      pt: 'Desenhou o pior sujeito',
      en: 'Drew the worst subject',
    },
  },
};

export default achievementsReference;
