// Types
import type { AchievementReference } from 'types/game';

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

export default achievementsReference;
