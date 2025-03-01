import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'QUARTETOS',
  ROUTE: 'quartetos',
  RELEASE_DATE: '2025-03-01',
  COLOR: 'rgba(243, 145, 189, 0.85)',
  EMOJI: '🗂',
  HUB_ICON: DailyGroupingGameIcon,
  HUB_NAME: { pt: 'Quartetos', en: 'Quartets' },
  NAME: { pt: 'Quartetos', en: 'Connect Four' },
  TAGLINE: {
    pt: 'Conecte quatro palavras relacionadas!',
    en: 'Connect four related words!',
  },
  // Custom settings
  HEARTS: 4,
};
