// Types
import type { ArteRuimCardData } from 'types/tdr';
// Pages
import type { DateKey } from '@pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  played: boolean;
};

export type SessionState = {
  cards: ArteRuimCardData[];
  drawings: string[];
  cardIndex: number;
  screen: 'idle' | 'playing' | 'saving';
};

export type DailyPicacoEntry = {
  id: DateKey;
  number: number;
  type: 'artista' | 'picaco';
  cards: ArteRuimCardData[];
};

export type DrawingToSave = {
  drawing: string;
  cardId: string;
  level: number;
  playerId: UID;
  successRate: number;
  text: string;
};
