// Icons
import { DailyChildrenGameIcon } from 'icons/DailyChildrenGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PIRRALHOS',
  ROUTE: 'pirralhos',
  TYPE: 'game',
  RELEASE_DATE: '2026-05-15',
  COLOR: 'rgba(251, 232, 124, 0.85)',
  EMOJI: '🧒',
  HUB_ICON: DailyChildrenGameIcon,
  NAME: { pt: 'Pirralhos', en: 'Rascals' },
  VERSION: 'demo',
  TAGLINE: {
    pt: 'Desvende quem pegou o brinquedo!',
    en: 'Uncover who took the toy!',
  },
  // Custom settings
  HEARTS: 3,
};
