// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  LEAD_MISSION: 'LEAD_MISSION', // Had a mission card
  FIRST_CARD_PLAYED: 'FIRST_CARD_PLAYED', // Played the first card on a mission
  COMPLETED_MISSION: 'COMPLETED_MISSION', // PLayed the complete mission card
  MOST_WRONG_CARDS: 'MOST_WRONG_CARDS', // Played the most wrong cards in a mission
  HELP_CARD: 'HELP_CARD', // Played a help card
  SUCCESSFUL_ESCAPE: 'SUCCESSFUL_ESCAPE', // All players
  FAILED_ESCAPE: 'FAILED_ESCAPE', // All players
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.LEAD_MISSION]: {
    icon: 'star',
    title: {
      pt: 'Líder da Missão',
      en: 'Mission Leader',
    },
    description: {
      pt: 'Você foi o líder da missão e teve a carta de missão mais vezes.',
      en: 'You were the mission leader and had the mission card most times.',
    },
  },
};

export default ACHIEVEMENTS;
