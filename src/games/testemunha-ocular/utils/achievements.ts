import type { AchievementReference } from 'types/achievements';

export const ACHIEVEMENTS = {
  PLAYED_AS_WITNESS: 'PLAYED_AS_WITNESS',
  BEST_QUESTIONS: 'BEST_QUESTIONS',
  MOST_USELESS_QUESTIONS: 'MOST_USELESS_QUESTIONS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.PLAYED_AS_WITNESS]: {
    icon: 'glasses',
    title: {
      pt: 'Testemunha Ocular',
      en: 'Witness',
    },
    description: {
      pt: 'Jogou como testemunha',
      en: 'Played as a witness',
    },
  },
  [ACHIEVEMENTS.BEST_QUESTIONS]: {
    icon: 'dialog',
    title: {
      pt: 'Melhores Perguntas',
      en: 'Best Questions',
    },
    description: {
      pt: 'Suas perguntas eliminaram mais suspeitos',
      en: 'Your questions eliminated more suspects',
    },
  },
  [ACHIEVEMENTS.MOST_USELESS_QUESTIONS]: {
    icon: 'broken-chain',
    title: {
      pt: 'Perguntas Menos Úteis',
      en: 'Least Useful Questions',
    },
    description: {
      pt: 'Suas perguntas eliminaram menos suspeitos',
      en: 'Your questions eliminated fewer suspects',
    },
  },
};

export default achievementsReference;
