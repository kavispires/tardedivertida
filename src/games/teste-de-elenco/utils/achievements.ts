export const ACHIEVEMENTS = {
  ALONE_VOTES: 'ALONE_VOTES',
  TOGETHER_VOTES: 'TOGETHER_VOTES',
  MOST_CAST: 'MOST_CAST',
  FEWEST_CAST: 'FEWEST_CAST',
  CONSISTENCY: 'CONSISTENCY',
  CHANGELING: 'CHANGELING',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.ALONE_VOTES]: {
    icon: 'person',
    title: {
      pt: 'Iniciante',
      en: 'Beginner',
    },
    description: {
      pt: 'Votou sozinho em um ator mais vezes',
      en: 'Voted alone on an actor the most',
    },
  },
  [ACHIEVEMENTS.TOGETHER_VOTES]: {
    icon: 'people',
    title: {
      pt: 'Profissional',
      en: 'Professional',
    },
    description: {
      pt: 'Votou com alguém em um ator mais vezes',
      en: 'Voted with someone on an actor the most',
    },
  },
  [ACHIEVEMENTS.MOST_CAST]: {
    icon: 'eye',
    title: {
      pt: 'Melhor olheiro',
      en: 'Best scout',
    },
    description: {
      pt: 'Escalou mais atores',
      en: 'Cast the most actors',
    },
  },
  [ACHIEVEMENTS.FEWEST_CAST]: {
    icon: 'broken-bulb',
    title: {
      pt: 'Pior olheiro',
      en: 'Wrost scout',
    },
    description: {
      pt: 'Escalou menos atores',
      en: 'Cast the fewest actors',
    },
  },
  [ACHIEVEMENTS.CONSISTENCY]: {
    icon: 'scale',
    title: {
      pt: 'Mais Persistente',
      en: 'Most Persistent',
    },
    description: {
      pt: 'Votou nos mesmos atores mais vezes',
      en: 'Voted on the same actors the most',
    },
  },
  [ACHIEVEMENTS.CHANGELING]: {
    icon: 'arrows',
    title: {
      pt: 'Troca-troca',
      en: 'Mind changer',
    },
    description: {
      pt: 'Votou em mais atores diferentes',
      en: 'Voted on the most different actors',
    },
  },
};
