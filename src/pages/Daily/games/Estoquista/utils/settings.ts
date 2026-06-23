// Icons
import { DailyWarehouseGameIcon } from '@icons/DailyWarehouseGameIcon';
// Pages
import type { GameSettings } from '@pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: 'ESTOQUISTA',
  ROUTE: 'estoquista',
  TYPE: 'game',
  RELEASE_DATE: '2024-08-04',
  VERSION: 'stable',
  COLOR: 'rgba(249, 205, 84, 0.85)',
  EMOJI: '📦',
  HUB_ICON: DailyWarehouseGameIcon,
  NAME: { pt: 'Estoquista', en: 'Warehouser' },
  TAGLINE: {
    pt: 'Venha aplicar um feng-shui nessa prateleira!',
    en: 'Come apply some feng-shui to this shelf!',
  },
  HEARTS: 4,
};

export const PHASES = {
  STOCKING: 'STOCKING',
  FULFILLING: 'FULFILLING',
  DELIVERING: 'DELIVERING',
} as const;
