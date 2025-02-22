import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'QUARTETOS',
  ROUTE: 'quartetos',
  COLOR: 'rgba(243, 145, 189, 0.85)',
  EMOJI: '🗂',
  HUB_ICON: DailyGroupingGameIcon,
  HUB_NAME: { pt: 'Quarteto', en: 'Quartet' },
  NAME: { pt: 'Quartetos', en: 'Connect Four' },
  TAGLINE: {
    pt: 'Conecte quatro palavras relacionadas!',
    en: 'Connect four related words!',
  },
  // Custom settings
  HEARTS: 4,
};
