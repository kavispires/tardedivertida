// Icons
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'ARTE_RUIM',
  ROUTE: 'arte-ruim',
  TYPE: 'game',
  RELEASE_DATE: '2023-11-04',
  VERSION: 'stable',
  COLOR: 'rgba(174, 169, 223, 0.85)',
  EMOJI: '🖼️',
  HUB_ICON: DailyArtGameIcon,
  NAME: { pt: 'Arte Ruim', en: 'Is It Art?' },
  TAGLINE: {
    pt: 'Adivinhe o título das obras de arte!',
    en: 'Guess the title of the artworks!',
  },
  // Custom settings
  HEARTS: 3,
};
