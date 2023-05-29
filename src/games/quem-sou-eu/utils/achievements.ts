const ACHIEVEMENTS = {
  MOST_GLYPHS: 'MOST_GLYPHS',
  LEAST_GLYPHS: 'LEAST_GLYPHS',
  MOST_POSITIVE: 'MOST_POSITIVE',
  LEAST_POSITIVE: 'LEAST_POSITIVE',
  MOST_NEGATIVE: 'MOST_NEGATIVE',
  LEAST_NEGATIVE: 'LEAST_NEGATIVE',
  SINGLE_ICON: 'SINGLE_ICON',
  TABLE_VOTES: 'TABLE_VOTES',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_GLYPHS]: {
    icon: 'arrow-up',
    title: {
      pt: 'Melhor Uso dos Ícones',
      en: 'Best Glyph User',
    },
    description: {
      pt: 'Usou o maior número de ícones durante o jogo',
      en: 'Used the most glyphs during the game',
    },
  },
  [ACHIEVEMENTS.LEAST_GLYPHS]: {
    icon: 'arrow-down',
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Usou o menor número de ícones durante o jogo',
      en: 'Used the fewest glyphs during the game',
    },
  },
  [ACHIEVEMENTS.MOST_POSITIVE]: {
    icon: 'thumbs-up',
    title: {
      pt: 'Mais Positivo',
      en: 'Most Positive',
    },
    description: {
      pt: 'Usou mais ícones no lado positivo',
      en: 'Used the most glyphs on the positive side',
    },
  },
  [ACHIEVEMENTS.LEAST_POSITIVE]: {
    icon: 'arrow-left',
    title: {
      pt: 'Menos Positivo',
      en: 'Least Positive',
    },
    description: {
      pt: 'Usou menos ícones no lado positivo',
      en: 'Used the least glyphs on the positive side',
    },
  },
  [ACHIEVEMENTS.MOST_NEGATIVE]: {
    icon: 'thumbs-down',
    title: {
      pt: 'Mais Negativo',
      en: 'Most Negative',
    },
    description: {
      pt: 'Usou mais ícones no lado negativo',
      en: 'Used the most glyphs on the negative side',
    },
  },
  [ACHIEVEMENTS.LEAST_NEGATIVE]: {
    icon: 'arrow-right',
    title: {
      pt: 'Menos Negativo',
      en: 'Least Negative',
    },
    description: {
      pt: 'Usou menos ícones no lado negativo',
      en: 'Used the least glyphs on the negative side',
    },
  },
  [ACHIEVEMENTS.SINGLE_ICON]: {
    icon: 'one',
    title: {
      pt: 'Mais Único',
      en: 'Most Unique',
    },
    description: {
      pt: 'Usou apenas um ícone mais vezes',
      en: 'Used a single icon most times',
    },
  },
  [ACHIEVEMENTS.TABLE_VOTES]: {
    icon: 'table',
    title: {
      pt: 'Melhor Votador Pra Mesa',
      en: 'Best Table Voter',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
  [ACHIEVEMENTS.CHOOSE_FOR_ME]: {
    icon: 'dice',
    title: {
      pt: 'Menos Brasileiro',
      en: 'The Shirker',
    },
    description: {
      pt: 'Apertou o botão Chutar Restantes mais vezes',
      en: "Pressed 'Guess for me' the most",
    },
  },
};

export default achievementsReference;
