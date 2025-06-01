import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyMemoryGridGameIcon } from 'icons/DailyMemoryGridGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'ORGANIKU',
  ROUTE: 'organiku',
  RELEASE_DATE: '2024-05-30',
  COLOR: 'rgba(186, 243, 154, 0.85)',
  EMOJI: '🧸',
  HUB_ICON: DailyMemoryGridGameIcon,
  HUB_NAME: { pt: 'Organiku', en: 'Organiku' },
  NAME: { pt: 'Organização Sudoku', en: 'Sudoku Organization' },
  TAGLINE: {
    en: 'Can you organize the table?',
    pt: 'Consegue organizar a mesa?',
  },
  VERSION: 'demo',
  // Custom settings
  HEARTS: 5,
};
