import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'PORTAIS_MAGICOS',
  ROUTE: 'portais-magicos',
  RELEASE_DATE: '2024-04-30',
  COLOR: 'rgba(255, 171, 145, 0.85)',
  EMOJI: '🚪',
  HUB_ICON: DailyImagesGameIcon,
  HUB_NAME: { pt: 'Portais', en: 'Portals' },
  NAME: { pt: 'Portais Mágicos', en: 'Magic Doors' },
  TAGLINE: {
    pt: 'Descubra o que há por trás desses portais!',
    en: 'Discover what lies beyond these doors!',
  },
  // Custom settings
  HEARTS: 4,
};
