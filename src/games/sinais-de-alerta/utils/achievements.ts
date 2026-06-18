// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  CHOOSE_FOR_ME: {
    id: 'CHOOSE_FOR_ME',
    doc: 'Times players pressed the ',
    icon: 'dice',
    title: {
      en: 'Guess for me',
      pt: 'Chute para mim',
    },
    description: {
      en: 'Used the guess for me option the most',
      pt: 'Usou a opção de chutar mais vezes',
    },
  },
  BEST_DESCRIPTOR: {
    id: 'BEST_DESCRIPTOR',
    doc: 'Times players got the descriptor right based on your drawing',
    icon: 'star',
    title: {
      en: 'Best descriptor',
      pt: 'Melhor descritor',
    },
    description: {
      en: 'Drew the best descriptor',
      pt: 'Desenhou o melhor descritor',
    },
  },
  WORST_DESCRIPTOR: {
    id: 'WORST_DESCRIPTOR',
    doc: 'Times players got the descriptor right based on your drawing',
    icon: 'face-oops',
    title: {
      en: 'Not so skilled descriptor',
      pt: 'Descritor menos habilidoso',
    },
    description: {
      en: 'Drew the worst descriptor',
      pt: 'Desenhou o pior descritor',
    },
  },
  FEWEST_DESCRIPTORS: {
    id: 'FEWEST_DESCRIPTORS',
    doc: 'Times it got the descriptor right',
    icon: 'face-dead',
    title: {
      en: 'Fewest descriptors',
      pt: 'Menos descritivos',
    },
    description: {
      en: 'Guessed the least descriptors',
      pt: 'Acertou menos descritores',
    },
  },
  MOST_DESCRIPTORS: {
    id: 'MOST_DESCRIPTORS',
    doc: 'Times it got the descriptor right',
    icon: 'glasses',
    title: {
      en: 'Most descriptive',
      pt: 'Mais descritivo',
    },
    description: {
      en: 'Guessed the most descriptors',
      pt: 'Acertou mais descritores',
    },
  },
  BEST_SUBJECT: {
    id: 'BEST_SUBJECT',
    doc: 'Times players got the subject right based on your drawing',
    icon: 'flower',
    title: {
      en: 'Best subject',
      pt: 'Melhor sujeito',
    },
    description: {
      en: 'Drew the best subject',
      pt: 'Desenhou o melhor sujeito',
    },
  },
  WORST_SUBJECT: {
    id: 'WORST_SUBJECT',
    doc: 'Times players got the subject right based on your drawing',
    icon: 'face-perplexed',
    title: {
      en: 'Not so skilled subject',
      pt: 'Sujeito mais mais ou menos',
    },
    description: {
      en: 'Drew the worst subject',
      pt: 'Desenhou o pior sujeito',
    },
  },
  FEWEST_SUBJECTS: {
    id: 'FEWEST_SUBJECTS',
    doc: 'Times it got the subject right',
    icon: 'face-fed-up',
    title: {
      en: 'Fewest subjects',
      pt: 'Menos sujeitos',
    },
    description: {
      en: 'Guessed the least subjects',
      pt: 'Acertou menos sujeitos',
    },
  },
  MOST_SUBJECTS: {
    id: 'MOST_SUBJECTS',
    doc: 'Times it got the subject right',
    icon: 'dialog',
    title: {
      en: 'Most subjects',
      pt: 'Mais sujeitos',
    },
    description: {
      en: 'Guessed the most subjects',
      pt: 'Acertou mais sujeitos',
    },
  },
  TABLE_VOTES: {
    id: 'TABLE_VOTES',
    doc: 'Times players voted for the table',
    icon: 'table',
    title: {
      en: 'Table vote',
      pt: 'Voto no extra',
    },
    description: {
      en: 'Voted on non-player cards more times',
      pt: 'Votou em cartas que não era de jogadores mais vezes',
    },
  },
};

export default achievementsReference;
