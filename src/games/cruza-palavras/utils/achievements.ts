const ACHIEVEMENTS = {
  BEST_CLUES: 'BEST_CLUES',
  WORST_CLUES: 'WORST_CLUES',
  BEST_GUESSER: 'BEST_GUESSER',
  WORST_GUESSER: 'WORST_GUESSER',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
  SHORTEST_WORDS: 'SHORTEST_WORDS',
  LONGEST_WORDS: 'LONGEST_WORDS',
  SAVIOR: 'SAVIOR',
};
export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BEST_CLUES]: {
    icon: 'thumbs-up',
    title: {
      pt: 'Melhor Cruzador',
      en: 'Best Mixer',
    },
    description: {
      pt: 'Jogadores acertaram suas dicas mais vezes',
      en: 'Players got their clues correctly the most',
    },
  },
  [ACHIEVEMENTS.WORST_CLUES]: {
    icon: '',
    title: {
      pt: 'Mais obscuro',
      en: 'Most obscure',
    },
    description: {
      pt: 'Foi possuído menos vezes',
      en: 'Was possessed the least',
    },
  },
  [ACHIEVEMENTS.BEST_GUESSER]: {
    icon: 'check-mark',
    title: {
      pt: 'Melhor Adivinhador',
      en: 'Best Guesser',
    },
    description: {
      pt: 'Acertou as dicas mais vezes',
      en: 'Got clues right the most',
    },
  },
  [ACHIEVEMENTS.WORST_GUESSER]: {
    icon: 'x',
    title: {
      pt: 'Pior Adivinhador',
      en: 'Worst Guesser',
    },
    description: {
      pt: 'Errou as dicas mais vezes',
      en: 'Got clues wrong the most',
    },
  },
  [ACHIEVEMENTS.LONGEST_WORDS]: {
    icon: 'dialog',
    title: {
      pt: 'Mais Falador',
      en: 'Best Speaker',
    },
    description: {
      pt: 'Usou as dicas mais longas',
      en: 'Used the longest words',
    },
  },
  [ACHIEVEMENTS.SHORTEST_WORDS]: {
    icon: 'minus',
    title: {
      pt: 'Mais Quieto',
      en: 'Quieter',
    },
    description: {
      pt: 'Usou as dias mais curtas',
      en: 'Used the shortest words',
    },
  },
  [ACHIEVEMENTS.SAVIOR]: {
    icon: 'heart',
    title: {
      pt: 'O Salvador',
      en: 'The Savior',
    },
    description: {
      pt: 'Foi o único a acertar a dica de alguém mais vezes, impedindo eles de perderem pontos',
      en: 'Guessed a clue by themselves the most preventing a player to lose points',
    },
  },

  [ACHIEVEMENTS.CHOOSE_FOR_ME]: {
    icon: 'dice',
    title: {
      pt: 'Mais Desistível',
      en: 'Best Shirker',
    },
    description: {
      pt: 'Apertou o botão Chutar Restantes mais vezes',
      en: "Pressed 'Guess for me' the most",
    },
  },
};

export default achievementsReference;
