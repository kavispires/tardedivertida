// Icons
import { DailyButtonGameIcon } from '@icons/DailyButtonGameIcon';
// Pages
import type { GameSettings } from '@pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PANICO',
  ROUTE: 'panico',
  TYPE: 'game',
  RELEASE_DATE: '2026-05-10',
  COLOR: 'rgba(126, 133, 147, 0.85)',
  EMOJI: '🔘',
  HUB_ICON: DailyButtonGameIcon,
  NAME: { pt: 'Pânico!', en: 'Panic!' },
  TAGLINE: {
    en: 'Would you press the button?',
    pt: 'Você apertaria o botão?',
  },
  VERSION: 'unreleased',
  // Custom settings
  HEARTS: 5,
};
