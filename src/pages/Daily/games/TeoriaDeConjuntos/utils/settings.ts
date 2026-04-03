// Icons
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'TEORIA_DE_CONJUNTOS',
  ROUTE: 'teoria-de-conjuntos',
  TYPE: 'game',
  RELEASE_DATE: '2024-08-31',
  COLOR: 'rgba(195, 135, 202, 0.85)',
  EMOJI: '⭕️',
  HUB_ICON: DailyDiagramGameIcon,
  NAME: { pt: 'Conjuntos', en: 'Diagrams' },
  TAGLINE: {
    pt: 'Quantas vogais têm em PQP?',
    en: 'Can you solve this set challenge?',
  },
  // Custom settings
  HEARTS: 4,
};
