import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'FILMACO',
  ROUTE: 'filmaco',
  COLOR: 'rgba(85, 161, 255, 0.85)',
  EMOJI: '🎬',
  HUB_ICON: DailyMovieGameIcon,
  HUB_NAME: { pt: 'Filmaço', en: 'Movicon' },
  NAME: { pt: 'Filmaço', en: 'Movicon' },
  TAGLINE: {
    pt: 'Pegue a pipoca e venha descobrir esse filme!',
    en: 'Grab the popcorn and come find out about this movie!',
  },
  // Custom settings
  HEARTS: 3,
};
