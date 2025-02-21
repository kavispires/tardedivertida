import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'AQUI_O',
  ROUTE: 'aqui-o',
  COLOR: 'rgba(227, 167, 111, 0.85)',
  EMOJI: '🔍',
  HUB_ICON: DailyFindingGameIcon,
  HUB_NAME: { pt: 'Aqui Ó', en: 'Find This' },
  NAME: { pt: 'Aqui Ó', en: 'Find This' },
  TAGLINE: {
    pt: 'Já encontrou a coisa em comum? Ela está...',
    en: 'Have you found the matching thing?',
  },
  // Custom settings
  GOAL: 15,
  HEARTS: 3,
  TD_DAILY_AQUI_O_MODE: 'TD_AQUI_DAILY_O_MODE',
  DURATION: 60,
};
