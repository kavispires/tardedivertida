// Icons
import { DailyMemoryGridGameIcon } from 'icons/DailyMemoryGridGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'ORGANIKU',
  ROUTE: 'organiku',
  TYPE: 'game',
  RELEASE_DATE: '2025-06-07',
  COLOR: 'rgba(211, 232, 124, 0.85)',
  EMOJI: '🧸',
  HUB_ICON: DailyMemoryGridGameIcon,
  HUB_NAME: { pt: 'Organiku', en: 'Organiku' },
  NAME: { pt: 'Organiku', en: 'Organiku' },
  TAGLINE: {
    en: 'Can you organize the table?',
    pt: 'Consegue organizar a mesa?',
  },
  VERSION: 'beta',
  // Custom settings
  HEARTS: 5,
};
