// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  UNKNOWN: 'UNKNOWN',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.UNKNOWN]: {
    icon: 'question',
    title: {
      pt: 'Desconhecido',
      en: 'Unknown',
    },
    description: {
      pt: 'Desconhecido',
      en: 'Unknown',
    },
  },
};
