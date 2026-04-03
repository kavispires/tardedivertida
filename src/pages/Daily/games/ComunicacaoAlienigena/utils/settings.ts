// Icons
import { DailyAlienGameIcon } from 'icons/DailyAlienGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'COMUNICACAO_ALIENIGENA',
  ROUTE: 'comunicacao-alienigena',
  TYPE: 'game',
  RELEASE_DATE: '2024-11-08',
  COLOR: 'rgba(145, 203, 196, 0.85)',
  EMOJI: '🛸',
  HUB_ICON: DailyAlienGameIcon,
  NAME: { pt: 'Alienígena', en: 'Alienate' },
  TAGLINE: {
    pt: 'Não sabe se comunicar com seu cônjuge?',
    en: 'Communication with the aliens is hard',
  },
  // Custom settings
  HEARTS: 4,
};
