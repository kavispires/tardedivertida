// Icons
import { DailyChildrenGameIcon } from '@icons/DailyChildrenGameIcon';
// Pages
import type { GameSettings } from '@pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'PIRRALHOS',
  ROUTE: 'pirralhos',
  TYPE: 'game',
  RELEASE_DATE: '2026-05-24',
  VERSION: 'stable',
  COLOR: 'rgba(251, 232, 124, 0.85)',
  EMOJI: '🧒',
  HUB_ICON: DailyChildrenGameIcon,
  NAME: { pt: 'Pirralhos', en: 'Rascals' },
  TAGLINE: {
    pt: 'Desvende quem pegou o brinquedo!',
    en: 'Uncover who took the toy!',
  },
  // Custom settings
  HEARTS: 3,
};
