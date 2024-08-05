import { DateKey } from 'pages/Daily/utils/types';

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
