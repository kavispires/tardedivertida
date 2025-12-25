// Types
import type { ArteRuimCard } from 'types/tdr';
// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  played: boolean;
};

export type SessionState = {
  cards: ArteRuimCard[];
  drawings: string[];
  cardIndex: number;
  screen: 'idle' | 'playing' | 'saving';
};

export type DailyPicacoEntry = {
  id: DateKey;
  number: number;
  type: 'artista';
  cards: ArteRuimCard[];
};

export type DrawingToSave = {
  drawing: string;
  cardId: string;
  level: number;
  playerId: PlayerId;
  successRate: number;
  text: string;
};
