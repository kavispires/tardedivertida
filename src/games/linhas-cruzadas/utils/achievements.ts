const ACHIEVEMENTS = {
  SLOWEST_DRAWER: 'SLOWEST_DRAWER',
  QUICKEST_DRAWER: 'QUICKEST_DRAWER',
  SLOWEST_GUESSER: 'SLOWEST_GUESSER',
  QUICKEST_GUESSER: 'QUICKEST_GUESSER',
  RANDOM_PROMPT_SELECTION: 'RANDOM_PROMPT_SELECTION',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.QUICKEST_DRAWER]: {
    icon: 'hare',
    title: {
      pt: 'Desenhista Mais Rápido',
      en: 'Quickest Drawer',
    },
    description: {
      pt: 'Levou menos tempo para desenhar',
      en: 'Took the least time to draw',
    },
  },
  [ACHIEVEMENTS.SLOWEST_DRAWER]: {
    icon: 'snail',
    title: {
      pt: 'Desenhista Mais Metódico',
      en: 'Most Methodical Drawer',
    },
    description: {
      pt: 'Levou mais tempo para desenhar',
      en: 'Took the most time to draw',
    },
  },
  [ACHIEVEMENTS.QUICKEST_GUESSER]: {
    icon: 'check-mark',
    title: {
      pt: 'Adivinhador Mais Rápido',
      en: 'Quickest Guesser',
    },
    description: {
      pt: 'Levou menos tempo para adivinhar',
      en: 'Took the least time to guess',
    },
  },
  [ACHIEVEMENTS.SLOWEST_GUESSER]: {
    icon: 'brain',
    title: {
      pt: 'Mais analítico',
      en: 'Most Analytical',
    },
    description: {
      pt: 'Levou mais tempo para adivinhar',
      en: 'Took the most time to guess',
    },
  },
  [ACHIEVEMENTS.RANDOM_PROMPT_SELECTION]: {
    icon: 'dice',
    title: {
      pt: 'Mais Corajoso',
      en: 'Bravest',
    },
    description: {
      pt: 'Único que clicou em "Aleatório" ao escolher a carta inicial',
      en: 'The only one who clicked "Random" when choosing the initial card',
    },
  },
};

export default achievementsReference;
