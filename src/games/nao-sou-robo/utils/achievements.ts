import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_ROBOT: 'MOST_ROBOT',
  LEAST_ROBOT: 'LEAST_ROBOT',
  MOST_ALONE_CORRECT: 'MOST_ALONE_CORRECT',
  MOST_ALONE_ROBOT: 'MOST_ALONE_ROBOT',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_ROBOT]: {
    icon: 'robot',
    title: {
      pt: 'Mais Desumano',
      en: 'Most Inhuman',
    },
    description: {
      pt: 'Votou no robô mais vezes',
      en: 'Voted for the robot the most',
    },
  },
  [ACHIEVEMENTS.LEAST_ROBOT]: {
    icon: 'person',
    title: {
      pt: 'Mais Humano',
      en: 'Most Human',
    },
    description: {
      pt: 'Selecionou o robô menos vezes',
      en: 'Selected the robot the least',
    },
  },
  [ACHIEVEMENTS.MOST_ALONE_CORRECT]: {
    icon: 'one',
    title: {
      pt: 'Melhor Solitário',
      en: 'Best Lone Wolf',
    },
    description: {
      pt: 'Votou corretamente mais vezes sozinho',
      en: 'Voted correctly alone the most',
    },
  },
  [ACHIEVEMENTS.MOST_ALONE_ROBOT]: {
    icon: 'x',
    title: {
      pt: 'Anti-fã',
      en: 'Anti-fan',
    },
    description: {
      pt: 'Votou sozinho no robô mais vezes',
      en: 'Vote alone for the robot the most',
    },
  },
};

export default achievementsReference;
