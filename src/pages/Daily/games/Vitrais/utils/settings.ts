// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'VITRAIS',
  ROUTE: 'vitrais',
  RELEASE_DATE: '2025-12-24',
  COLOR: 'rgba(255, 150, 29, 0.85)',
  EMOJI: '🧩',
  HUB_ICON: DailyPuzzleGameIcon,
  HUB_NAME: { pt: 'Vitrais', en: 'Vitrais' },
  NAME: { pt: 'Vitrais', en: 'Vitrais' },
  TAGLINE: {
    en: 'Are you puzzled enough to do this?',
    pt: 'Já quebrou a cabeça hoje?',
  },
  VERSION: 'stable',
  // Custom settings
  HEARTS: 5,
  HEART_LOSS_INTERVAL_SECONDS: 20,
};
