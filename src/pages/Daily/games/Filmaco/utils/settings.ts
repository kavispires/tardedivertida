// Icons
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'FILMACO',
  ROUTE: 'filmaco',
  TYPE: 'game',
  RELEASE_DATE: '2024-05-30',
  VERSION: 'stable',
  COLOR: 'rgba(118, 151, 226, 0.85)',
  EMOJI: '🎬',
  HUB_ICON: DailyMovieGameIcon,
  NAME: { pt: 'Filmaço', en: 'Movicon' },
  TAGLINE: {
    pt: 'Pegue a pipoca e venha descobrir esse filme!',
    en: 'Grab the popcorn and come find out about this movie!',
  },
  // Custom settings
  HEARTS: 3,
};
