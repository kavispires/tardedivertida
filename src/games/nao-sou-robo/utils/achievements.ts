// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_ALONE_CORRECT: {
    id: 'MOST_ALONE_CORRECT',
    doc: 'got the correct cards by themselves',
    icon: 'one',
    title: {
      en: 'Best Lone Wolf',
      pt: 'Melhor Solitário',
    },
    description: {
      en: 'Voted correctly alone the most',
      pt: 'Votou corretamente mais vezes sozinho',
    },
  },
  MOST_ALONE_ROBOT: {
    id: 'MOST_ALONE_ROBOT',
    doc: 'got the incorrect cards by themselves',
    icon: 'x',
    title: {
      en: 'Anti-fan',
      pt: 'Anti-fã',
    },
    description: {
      en: 'Vote alone for the robot the most',
      pt: 'Votou sozinho no robô mais vezes',
    },
  },
  LEAST_ROBOT: {
    id: 'LEAST_ROBOT',
    doc: 'chose robot cards',
    icon: 'person',
    title: {
      en: 'Most Human',
      pt: 'Mais Humano',
    },
    description: {
      en: 'Selected the robot the least',
      pt: 'Selecionou o robô menos vezes',
    },
  },
  MOST_ROBOT: {
    id: 'MOST_ROBOT',
    doc: 'chose robot cards',
    icon: 'robot',
    title: {
      en: 'Most Inhuman',
      pt: 'Mais Desumano',
    },
    description: {
      en: 'Voted for the robot the most',
      pt: 'Votou no robô mais vezes',
    },
  },
};

export default achievementsReference;
