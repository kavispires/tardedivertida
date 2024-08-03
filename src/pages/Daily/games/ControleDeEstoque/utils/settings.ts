export const SETTINGS = {
  NAME: { pt: 'Controle De Estoque', en: 'Warehouse Stock' },
  HEARTS: 4,
  LOCAL_TODAY_KEY: 'TD_DAILY_CONTROLE_DE_ESTOQUE_LOCAL_TODAY',
};

export const PHASES = {
  STOCKING: 'STOCKING',
  FULFILLING: 'FULFILLING',
  DELIVERING: 'DELIVERING',
} as const;
