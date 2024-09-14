import { DateKey } from 'pages/Daily/utils/types';
import { PHASES } from './settings';

export type GoodId = string;

export type GameState = {
  hearts: number;
  phase: keyof typeof PHASES;
  warehouse: (GoodId | null)[];
  fulfillments: { order: GoodId; shelfIndex: number }[];
  lastPlacedGoodId: GoodId | null;
  activeOrder: GoodId | null;
  latestAttempt: number | null;
  win: boolean;
  guesses: string[];
  evaluations: boolean[][];
  extraAttempts: number;
};

export type DailyControleDeEstoqueEntry = {
  id: DateKey;
  number: number;
  type: 'controle-de-estoque';
  language: Language;
  title: string;
  goods: string[];
  orders: string[];
};

export type ControleDeEstoqueLocalToday = {
  id: string;
  warehouse: string[];
  guesses: string[]; // <goodId>::<shelfIndex>[]
  number: number;
  extraAttempts: number;
};
