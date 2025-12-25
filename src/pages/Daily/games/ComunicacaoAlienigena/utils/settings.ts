// Icons
import { DailyAlienGameIcon } from 'icons/DailyAlienGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'COMUNICACAO_ALIENIGENA',
  ROUTE: 'comunicacao-alienigena',
  RELEASE_DATE: '2024-11-08',
  COLOR: 'rgba(105, 218, 207, 0.85)',
  EMOJI: '🛸',
  HUB_ICON: DailyAlienGameIcon,
  HUB_NAME: { pt: 'Alienígena', en: 'Alien' },
  NAME: { pt: 'Comunicação Alienígena', en: 'Alien Communication' },
  TAGLINE: {
    pt: 'Não sabe se comunicar com seu cônjuge?',
    en: 'Communication with the aliens is hard',
  },
  // Custom settings
  HEARTS: 4,
};
