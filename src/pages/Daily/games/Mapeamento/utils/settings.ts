// Icons
import { DailyMapsGameIcon } from 'icons/DailyMapsGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'MAPEAMENTO',
  ROUTE: 'mapeamento',
  TYPE: 'game',
  RELEASE_DATE: '2023-11-04',
  COLOR: 'rgba(166, 201, 233, 0.85)',
  EMOJI: '🗺️',
  HUB_ICON: DailyMapsGameIcon,
  NAME: { pt: 'Mapeamento', en: 'Mapping' },
  TAGLINE: {
    pt: 'Onde estou? Quem sou eu? Pra onde vou?',
    en: 'Where am I? Who am I? Where am I going?',
  },
  // Custom settings
  HEARTS: 4,
};
