// Icons
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'QUARTETOS',
  ROUTE: 'quartetos',
  TYPE: 'game',
  RELEASE_DATE: '2025-03-01',
  COLOR: 'rgba(231, 157, 179, 0.85)',
  EMOJI: '🗂',
  HUB_ICON: DailyGroupingGameIcon,
  NAME: { pt: 'Quartetos', en: 'Quartets' },
  TAGLINE: {
    pt: 'Conecte quatro palavras relacionadas!',
    en: 'Connect four related words!',
  },
  // Custom settings
  HEARTS: 4,
};
