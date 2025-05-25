import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailySuspectGameIcon } from 'icons/DailySuspectGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'ESPIONAGEM',
  ROUTE: 'espionagem',
  RELEASE_DATE: '2024-05-30',
  COLOR: 'rgba(67, 183, 111, 0.85)',
  EMOJI: '🕵️‍♂️',
  HUB_ICON: DailySuspectGameIcon,
  HUB_NAME: { pt: 'Espionagem', en: 'Espionage' },
  NAME: { pt: 'Espionagem', en: 'Espionage' },
  TAGLINE: {
    en: 'Can you figure out who is the culprit?',
    pt: 'Consegue descobrir quem é o culpado?',
  },
  // Custom settings
  HEARTS: 2,
};
