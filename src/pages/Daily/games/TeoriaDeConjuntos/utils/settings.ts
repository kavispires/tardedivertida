import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'TEORIA_DE_CONJUNTOS',
  ROUTE: 'teoria-de-conjuntos',
  COLOR: 'rgba(172, 128, 221, 0.85)',
  EMOJI: '⭕️',
  HUB_ICON: DailyDiagramGameIcon,
  HUB_NAME: { pt: 'Conjuntos', en: 'Diagrams' },
  NAME: { pt: 'Teoria de Conjuntos', en: 'Diagram Theory' },
  TAGLINE: {
    pt: 'Quantas vogais têm em PQP?',
    en: 'Can you solve this set challenge?',
  },
  // Custom settings
  HEARTS: 4,
};
