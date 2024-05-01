import { DateKey } from 'pages/Daily/utils/types';
import { ArteRuimCard } from 'types/tdr';

export type DailyArtistaEntry = {
  id: DateKey;
  number: number;
  type: 'artista';
  cards: ArteRuimCard[];
};

export type ArtistaLocalToday = {
  id: DateKey;
  number: number;
  played: boolean;
};

export type DrawingToSave = {
  drawing: string;
  cardId: string;
  level: number;
  playerId: PlayerId;
  successRate: number;
  text: string;
};
