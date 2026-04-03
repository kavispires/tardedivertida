// Icons
import { DailyConexoesGameIcon } from 'icons/DailyConexoesGameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'CONEXOES',
  ROUTE: 'conexoes',
  TYPE: 'contribution',
  RELEASE_DATE: '2026-04-04',
  COLOR: 'rgba(232, 244, 248, 0.85)',
  EMOJI: '🔗',
  HUB_ICON: DailyConexoesGameIcon,
  NAME: { pt: 'Conexões', en: 'Connections' },
  TAGLINE: {
    pt: 'Ajude a conectar cartas relacionadas!',
    en: 'Help connect related cards!',
  },
  // Custom settings
  MIN_PAIRS: 10,
  TD_DAILY_CONEXOES_LOCAL_TODAY: 'TD_DAILY_CONEXOES_LOCAL_TODAY',
};
