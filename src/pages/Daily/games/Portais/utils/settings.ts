// Icons
import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PORTAIS',
  ROUTE: 'portais',
  TYPE: 'game',
  RELEASE_DATE: '2025-04-12',
  VERSION: 'stable',
  COLOR: 'rgba(222, 141, 93, 0.85)',
  EMOJI: '🚪',
  HUB_ICON: DailyImagesGameIcon,
  NAME: { pt: 'Portais', en: 'Portals' },
  TAGLINE: {
    pt: 'Descubra o que há por trás desses portais!',
    en: 'Discover what lies beyond these doors!',
  },
  // Custom settings
  HEARTS: 4,
};
