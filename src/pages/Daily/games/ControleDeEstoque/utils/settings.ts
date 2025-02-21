import type { GameSettings } from 'pages/Daily/utils/types';
// Icons
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';

export const SETTINGS: GameSettings = {
  KEY: 'CONTROLE_DE_ESTOQUE',
  ROUTE: 'controle-de-estoque',
  COLOR: 'rgba(255, 199, 59, 0.85)',
  EMOJI: '📦',
  HUB_ICON: DailyWarehouseGameIcon,
  HUB_NAME: { pt: 'Estoque', en: 'Warehouse' },
  NAME: { pt: 'Controle De Estoque', en: 'Warehouse Stock' },
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
