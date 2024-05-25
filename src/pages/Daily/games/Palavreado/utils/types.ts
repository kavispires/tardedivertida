import { DateKey } from 'pages/Daily/utils/types';

export type DailyPalavreadoEntry = {
  id: DateKey;
  number: number;
  type: 'palavreado';
  language: Language;
  keyword: string;
  letters: string[];
  words: string[];
};

export type PalavreadoLocalToday = {
  id: string;
  guesses: string[][];
  number: number;
  swaps: number;
};

export type PalavreadoLetter = {
  letter: string;
  // index: number;
  state: 'idle' | 'correct' | '0' | '1' | '2' | '3';
  locked: boolean;
};
