import type { DateKey } from 'pages/Daily/utils/types';
// Types
import type { SuspectCard } from 'types/tdr';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  released: string[];
};

export type StatementClue = {
  key: string;
  text: string;
  excludes: string[];
};

export type DailyEspionagemEntry = {
  id: DateKey;
  number: number;
  type: 'espionagem';
  setId: string;
  culpritId: string;
  statements: StatementClue[];
  isNsfw: boolean;
  suspects: SuspectCard[];
  reason: DualLanguageValue;
  level: number;
};

export type SessionState = {
  activeSuspectId: string | null;
};
