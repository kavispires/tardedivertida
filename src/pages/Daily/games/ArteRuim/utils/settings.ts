import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'ARTE_RUIM',
  ROUTE: 'arte-ruim',
  RELEASE_DATE: '2023-11-04',
  COLOR: 'rgba(158, 182, 244, 0.85)',
  EMOJI: '🖼️',
  HUB_ICON: DailyArtGameIcon,
  HUB_NAME: { pt: 'Arte Ruim', en: 'Is It Art?' },
  NAME: { pt: 'Arte Ruim', en: 'Questionable Art' },
  TAGLINE: {
    pt: 'Adivinhe o título das obras de arte!',
    en: 'Guess the title of the artworks!',
  },
  // Custom settings
  HEARTS: 3,
};
