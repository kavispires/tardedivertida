// Pages
import type { DateKey } from 'pages/Daily/utils/types';
// Internal
import type { PHASES } from './settings';

export type GoodId = string;

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  phase: keyof typeof PHASES;
  warehouse: (GoodId | null)[];
  fulfillments: { order: GoodId; shelfIndex: number }[];
  lastPlacedGoodId: GoodId | null;
  guesses: string[];
  evaluations: boolean[][];
  extraAttempts: number;
};

export type SessionState = {
  activeOrder: GoodId | null;
  latestAttempt: number | null;
};

export type DailyEstoquistaEntry = {
  id: DateKey;
  number: number;
  type: 'controle-de-estoque' | 'estoquista';
  language: Language;
  title: string;
  goods: string[];
  orders: string[];
};

// Backwards compatibility
export type DailyControleDeEstoqueEntry = DailyEstoquistaEntry;
