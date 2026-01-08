// Icons
import { DailyJudgingGameIcon } from 'icons/DailyJudgingGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'TA_NA_CARA',
  ROUTE: 'ta-na-cara',
  TYPE: 'contribution',
  RELEASE_DATE: '2025-02-21',
  COLOR: 'rgba(242, 233, 236, 0.85)',
  EMOJI: '👤',
  HUB_ICON: DailyJudgingGameIcon,
  HUB_NAME: { pt: 'Tá Na Cara', en: 'In Your Face' },
  NAME: { pt: 'Tá Na Cara', en: 'In Your Face' },
  TAGLINE: {
    pt: 'Julgue o livro pela capa! O cara pela cara!',
    en: 'Judge the book by its cover! The guy by his face!',
  },
  // Custom
  TD_DAILY_TA_NA_CARA_MODE: 'TD_DAILY_TA_NA_CARA_MODE',
};
