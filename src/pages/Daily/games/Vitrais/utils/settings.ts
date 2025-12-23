import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'VITRAIS',
  ROUTE: 'vitrais',
  RELEASE_DATE: '2025-06-07',
  COLOR: 'rgba(255, 150, 29, 0.85)',
  EMOJI: '🧩',
  HUB_ICON: DailyPuzzleGameIcon,
  HUB_NAME: { pt: 'Vitrais', en: 'Vitrais' },
  NAME: { pt: 'Vitrais', en: 'Vitrais' },
  TAGLINE: {
    en: 'Are you puzzled enough to do this?',
    pt: 'Já quebrou a cabeça hoje?',
  },
  VERSION: 'beta',
  // Custom settings
  HEARTS: 5,
  HEART_LOSS_INTERVAL_SECONDS: 25,
};
