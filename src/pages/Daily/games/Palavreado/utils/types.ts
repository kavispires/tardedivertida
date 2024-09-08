import { DailyGameStatus, DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  hearts: number;
  selection: number | null; // indexes of letters
  swap: number[]; // indexes of letters
  letters: PalavreadoLetter[];
  boardState: string[][];
  guesses: string[][]; // words guesses per heart
  state: string;
  swaps: number;
};

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
  boardState: string[][];
  number: number;
  swaps: number;
  status?: DailyGameStatus;
};

export type PalavreadoLetter = {
  letter: string;
  // index: number;
  state: 'idle' | 'correct' | '0' | '1' | '2' | '3' | '4';
  locked: boolean;
};
