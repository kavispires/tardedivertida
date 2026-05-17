// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  totalButtons: number;
  farthestButtonIndex: number;
};

export type DailyPanicoEntry = {
  id: DateKey;
  number: number;
  type: 'panico';
  buttons: string[];
};

export type SessionState = {
  activeButtonIndex: number;
  status: 'idle' | 'ongoing';
};
