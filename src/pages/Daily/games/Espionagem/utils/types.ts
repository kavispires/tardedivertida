import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  released: string[];
};

type StatementClue = {
  key: string;
  text: string;
  excludes: string[];
  type: 'testimony' | 'feature' | 'grid';
};

type SuspectEntry = {
  id: string;
  name: DualLanguageValue;
  gender: string;
  features: string[];
};

export type DailyEspionagemEntry = {
  id: DateKey;
  number: number;
  type: 'espionagem';
  setId: string;
  culpritId: string;
  statements: StatementClue[];
  additionalStatements: StatementClue[];
  isNsfw: boolean;
  suspects: SuspectEntry[];
  reason: DualLanguageValue;
  level: number;
};

export type SessionState = {
  activeSuspectId: string | null;
};
