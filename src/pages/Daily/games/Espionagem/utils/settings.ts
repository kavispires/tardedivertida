// Icons
import { DailySuspectGameIcon } from 'icons/DailySuspectGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'ESPIONAGEM',
  ROUTE: 'espionagem',
  RELEASE_DATE: '2025-07-05',
  TYPE: 'game',
  COLOR: 'rgba(125, 192, 121, 0.85)',
  EMOJI: '🕵️‍♂️',
  HUB_ICON: DailySuspectGameIcon,

  NAME: { pt: 'Espionagem', en: 'Espionage' },
  TAGLINE: {
    en: 'Can you figure out who is the culprit?',
    pt: 'Consegue descobrir quem é o culpado?',
  },
  // Custom settings
  HEARTS: 2,
  VERSION: 'stable',
};
