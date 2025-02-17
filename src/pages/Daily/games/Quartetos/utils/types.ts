import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  hearts: number;
  guesses: string[];
  matches: QuartetosSet[];
  grid: string[];
  status: string;
  completeSets: string[];
};

export type SessionState = {
  selection: string[];
  latestAttempt: number;
};

export type QuartetosSet = {
  id: string;
  title: string;
  itemsIds: string[];
  level: number;
};

export type DailyQuartetosEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'quartetos';
  grid: string[]; // 4x4
  difficulty: number;
  sets: QuartetosSet[];
};

export type QuartetosLocalToday = {
  id: DateKey;
  number: number;
} & GameState;
