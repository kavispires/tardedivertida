// Icons
import { DailySuspectGameIcon } from 'icons/DailySuspectGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'INVESTIGACAO',
  ROUTE: 'investigacao',
  TYPE: 'game',
  RELEASE_DATE: '2025-07-05',
  VERSION: 'stable',
  COLOR: 'rgba(125, 192, 121, 0.85)',
  EMOJI: '🕵️‍♂️',
  HUB_ICON: DailySuspectGameIcon,

  NAME: { pt: 'Investigação', en: 'Investigation' },
  TAGLINE: {
    en: 'Can you figure out who is the culprit?',
    pt: 'Consegue descobrir quem é o culpado?',
  },
  // Custom settings
  HEARTS: 3,
};
