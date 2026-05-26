// Icons
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'AQUI_O',
  ROUTE: 'aqui-o',
  TYPE: 'game',
  RELEASE_DATE: '2024-04-30',
  VERSION: 'stable',
  COLOR: 'rgba(237, 202, 158, 0.85)',
  EMOJI: '🔍',
  HUB_ICON: DailyFindingGameIcon,
  NAME: { pt: 'Aqui Ó', en: 'Find This' },
  TAGLINE: {
    pt: 'Já encontrou a coisa em comum? Ela está...',
    en: 'Have you found the matching thing?',
  },
  // Custom settings
  GOAL: 15,
  HEARTS: 3,
  TD_DAILY_AQUI_O_MODE: 'TD_AQUI_DAILY_O_MODE',
  TD_DAILY_AQUI_O_VOICE: 'TD_AQUI_DAILY_O_VOICE',
  DURATION: 60,
};
