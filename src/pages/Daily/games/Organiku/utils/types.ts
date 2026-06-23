// Pages
import type { DateKey } from '@pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  revealed: Dictionary<boolean>;
  foundCount: Dictionary<number>;
  flips: number;
};

export type DailyOrganikuEntry = {
  id: DateKey;
  number: number;
  type: 'organiku';
  setId: string;
  title: string;
  itemsIds: UID[];
  grid: UID[];
  defaultRevealedIndexes: number[];
};

export type SessionState = {
  activeTileIndex: number | null;
  pairActiveTileIndex: number | null;
};
