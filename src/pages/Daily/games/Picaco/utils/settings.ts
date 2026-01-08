// Icons
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PICACO',
  ROUTE: 'picaco',
  TYPE: 'contribution',
  RELEASE_DATE: '2024-04-30',
  COLOR: 'rgba(234, 236, 241, 0.85)',
  EMOJI: '🎨',
  HUB_ICON: DailyDrawingGameIcon,
  HUB_NAME: { pt: 'Picaço!', en: 'Big Artist' },
  NAME: { pt: 'Picaço!', en: 'Big Artist' },
  TAGLINE: {
    pt: 'Já desenhou hoje? Novas frases todos os dias!',
    en: 'Already drawn today? New phrases every day!',
  },
  // Custom settings
  DURATION: 60,
  DRAWINGS: 6,
};
