// Pages
import type { DateKey } from '@pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[];
};

export type DailyMapeamentoEntry = {
  id: DateKey;
  number: number;
  type: 'mapeamento';
  language: Language;
  setId: string;
  location: string;
  clues: string[];
};
