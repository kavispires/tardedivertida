// Icons
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PALAVREADO',
  ROUTE: 'palavreado',
  TYPE: 'game',
  RELEASE_DATE: '2024-05-10',
  COLOR: 'rgba(239, 83, 80, 0.85)',
  EMOJI: '🔤',
  HUB_ICON: DailyWordGameIcon,
  HUB_NAME: { pt: 'Palavreado', en: 'Rewording' },
  NAME: { pt: 'Palavreado', en: 'Rewording' },
  TAGLINE: {
    pt: 'E se o caça palavras estivesse todo embaralhado?',
    en: 'What if the word search was all scrambled?',
  },
  // Custom settings
  HEARTS: 4,
  WORD_LENGTH: 4,
};
