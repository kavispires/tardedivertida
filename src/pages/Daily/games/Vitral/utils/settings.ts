// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'VITRAL',
  ROUTE: 'vitral',
  TYPE: 'game',
  RELEASE_DATE: '2025-12-24',
  COLOR: 'rgba(253, 176, 76, 0.85)',
  EMOJI: '🧩',
  HUB_ICON: DailyPuzzleGameIcon,
  NAME: { pt: 'Vitral', en: 'Stained Glass' },
  TAGLINE: {
    en: 'Are you puzzled enough to do this?',
    pt: 'Já quebrou a cabeça hoje?',
  },
  VERSION: 'stable',
  // Custom settings
  HEARTS: 5,
  HEART_LOSS_INTERVAL_SECONDS: 20,
};
