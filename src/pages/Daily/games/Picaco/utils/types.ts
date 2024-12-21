import type { DateKey } from 'pages/Daily/utils/types';
// Types
import type { ArteRuimCard } from 'types/tdr';

export type GameState = {
  cards: ArteRuimCard[];
  drawings: string[];
  cardIndex: number;
  played: boolean;
  screen: 'idle' | 'playing' | 'saving';
};

export type DailyPicacoEntry = {
  id: DateKey;
  number: number;
  type: 'artista';
  cards: ArteRuimCard[];
};

export type PicacoLocalToday = {
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
