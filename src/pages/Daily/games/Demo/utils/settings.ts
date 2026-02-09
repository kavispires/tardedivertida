// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'DEMO',
  ROUTE: 'demo',
  TYPE: 'game',
  RELEASE_DATE: '2025-12-24',
  COLOR: 'rgba(255, 150, 29, 0.85)',
  EMOJI: '🧪',
  HUB_ICON: DailyPuzzleGameIcon,
  HUB_NAME: { pt: 'Demonstração', en: 'Demo' },
  NAME: { pt: 'Demonstração', en: 'Demo' },
  TAGLINE: {
    en: 'This is just a demo, nothing to see here.',
    pt: 'Isto é apenas uma demonstração, nada para ver aqui.',
  },
  VERSION: 'demo',
  // Custom settings
  HEARTS: 5,
};
