// Icons
import { DailyPuzzleGameIcon } from 'icons/DailyPuzzleGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'vitrais-infinitos',
  ROUTE: 'vitrais-infinitos',
  TYPE: 'game',
  RELEASE_DATE: '2025-02-08',
  COLOR: 'rgb(255 202 141 / 85%)',
  EMOJI: '🧩',
  HUB_ICON: DailyPuzzleGameIcon,
  HUB_NAME: { pt: 'Vitrais∞', en: 'Vitrais∞' },
  NAME: { pt: 'Vitrais Infinitos', en: 'Vitrais Infinite' },
  TAGLINE: {
    en: 'Are you puzzled enough to do this?',
    pt: 'Já quebrou a cabeça hoje?',
  },
  VERSION: 'stable',
};
