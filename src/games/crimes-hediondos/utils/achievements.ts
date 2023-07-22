export const ACHIEVEMENTS = {
  MOST_WRONG_GROUPS: 'MOST_WRONG_GROUPS',
  MOST_WRONG_GUESSES: 'MOST_WRONG_GUESSES',
  MOST_HALF_GUESSES: 'MOST_HALF_GUESSES',
  EARLIEST_CORRECT_GUESS: 'EARLIEST_CORRECT_GUESS',
  LATEST_CORRECT_GUESS: 'LATEST_CORRECT_GUESS',
  MOST_SELECTED_WEAPONS: 'MOST_SELECTED_WEAPONS',
  FEWEST_SELECTED_WEAPONS: 'FEWEST_SELECTED_WEAPONS',
  MOST_SELECTED_EVIDENCE: 'MOST_SELECTED_EVIDENCE',
  FEWEST_SELECTED_EVIDENCE: 'FEWEST_SELECTED_EVIDENCE',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_WRONG_GROUPS]: {
    icon: 'block',
    title: {
      pt: 'Mais Insistente',
      en: 'Most Persistent',
    },
    description: {
      pt: 'Escolheu o grupo/quadrante errado mais vezes',
      en: 'Chose the wrong group the most',
    },
  },
  [ACHIEVEMENTS.MOST_WRONG_GUESSES]: {
    icon: 'loupe',
    title: {
      pt: 'Melhor Examinador',
      en: 'Best Examiner',
    },
    description: {
      pt: 'Tentou o maior número de cards',
      en: 'Tried the largest number of cards',
    },
  },
  [ACHIEVEMENTS.MOST_HALF_GUESSES]: {
    icon: 'one',
    title: {
      pt: 'Acertador de Meio Termo',
      en: 'Half Guesser',
    },
    description: {
      pt: 'Acertou apenas um do par mais vezes',
      en: 'Got only one card of the pairs the most',
    },
  },
  [ACHIEVEMENTS.EARLIEST_CORRECT_GUESS]: {
    icon: 'hare',
    title: {
      pt: 'Mais Rápido',
      en: 'Fastest',
    },
    description: {
      pt: 'Acertou um crime primeiro',
      en: 'Guessed a crime correctly first',
    },
  },
  [ACHIEVEMENTS.LATEST_CORRECT_GUESS]: {
    icon: 'snail',
    title: {
      pt: 'Mais Analítico',
      en: 'Most Analytical',
    },
    description: {
      pt: 'Foi o que mais demorou para acertar um crime',
      en: 'Took the longest to guess a crime',
    },
  },
  [ACHIEVEMENTS.MOST_SELECTED_WEAPONS]: {
    icon: 'bullet',
    title: {
      pt: 'Especialista em Armas',
      en: 'Weapon Specialist',
    },
    description: {
      pt: 'Usou mais armas que os outros jogadores',
      en: 'Used more weapons than any other player',
    },
  },
  [ACHIEVEMENTS.FEWEST_SELECTED_WEAPONS]: {
    icon: 'heart',
    title: {
      pt: 'Pacifista',
      en: 'Pacifist',
    },
    description: {
      pt: 'Usou menos armas que os outros jogadores',
      en: 'Used fewer weapons than any other player',
    },
  },
  [ACHIEVEMENTS.MOST_SELECTED_EVIDENCE]: {
    icon: 'puzzle',
    title: {
      pt: 'Colecionador',
      en: 'Hoarder',
    },
    description: {
      pt: 'Usou mais objetos/evidências que os outros jogadores',
      en: 'Used more objects/evidence than any other player',
    },
  },
  [ACHIEVEMENTS.FEWEST_SELECTED_EVIDENCE]: {
    icon: 'box',
    title: {
      pt: 'Minimalista',
      en: 'Minimalist',
    },
    description: {
      pt: 'Usou menos objetos/evidências que os outros jogadores',
      en: 'Used fewer objects/evidence than any other player',
    },
  },
};

export default achievementsReference;
