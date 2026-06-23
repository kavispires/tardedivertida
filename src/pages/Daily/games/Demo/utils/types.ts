// Pages
import type { DateKey } from '@pages/Daily/utils/types';

export type DailyDemoEntry = {
  id: DateKey; // YYYY-MM-DD string
  number: number; // number of the puzzle, use 0
  type: 'demo';
  title: string;
};

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  timeElapsed: number;
  lockedPieces: string[]; // piece ids
  score: number;
};

export type SessionState = {
  key: string;
};

export type DailyVitraisEntryV2 = {
  id: DateKey; // YYYY-MM-DD string
  number: number; // number of the puzzle, use 0
  type: 'vitrais';
  key: string;
};
