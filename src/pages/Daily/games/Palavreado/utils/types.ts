// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type PalavreadoLetter = {
  letter: string;
  state: 'idle' | 'correct' | '0' | '1' | '2' | '3' | '4';
  locked: boolean;
};

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  letters: PalavreadoLetter[];
  boardState: string[][];
  guesses: string[][]; // words guesses per heart
  swaps: number;
};

export type SessionState = {
  selection: number | null; // indexes of letters
  swap: number[]; // indexes of letters
  latestAttempt: number;
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
