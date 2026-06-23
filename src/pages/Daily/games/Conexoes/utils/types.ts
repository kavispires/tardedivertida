// Pages
import type { DateKey } from '@pages/Daily/utils/types';

export type DailyConexoesEntry = {
  id: DateKey;
  number: number;
  type: 'conexoes';
  imageIds: string[];
};

export type GameState = {
  id: DateKey;
  number: number;
  played: boolean;
};

export type PairToEvaluate = {
  pairId: string; // Format: "imageId1::imageId2" (sorted alphabetically)
  imageId1: string;
  imageId2: string;
};

export type RelatedPair = {
  imageId1: string;
  imageId2: string;
};

export type SessionState = {
  pairs: PairToEvaluate[];
  currentPairIndex: number;
  relatedPairs: RelatedPair[]; // Pairs that users marked as related
  evaluatedCount: number;
  screen: 'idle' | 'playing' | 'saving';
  excludedPairIds: Set<string>; // Track all evaluated pairs to avoid duplicates
};

export type SavePayload = {
  pairs: RelatedPair[];
};
