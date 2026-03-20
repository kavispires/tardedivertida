// Types
import type { GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

export type SubmitPoolPayload = {
  poolIds: UID[];
  secretWordId: UID;
};

export type SubmitMetricsPayload = {
  metrics: Record<string, number>;
};

export type SubmitGuessPayload = {
  guesses: Guess[];
};

export type Guess = {
  cardId: UID;
  level: number;
  timestamp: number;
  playerId?: UID;
  score?: number;
  used?: boolean;
  retry?: boolean;
};

export type GalleryBracket = {
  score: number;
  playersIds: UID[];
  wrongGuesses: {
    playerId: UID;
    cardId: UID;
    invalid?: boolean;
  }[];
};

export type GalleryEntry = {
  secretWordId: UID;
  cards: Record<UID, TextCard>;
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<UID, number>;
  brackets: GalleryBracket[];
};

export type PhaseMetricsBuildingState = {
  presenterId: UID;
  turnOrder: GameOrder;
  wordsDict: Dictionary<TextCard>;
  secretCardsOptionsIds: UID[];
  availablePoolCardsIds: UID[];
  poolIds?: UID[];
  secretWordId?: UID;
  metricsDescriptors: Record<string, TextCard[]>;
  pointsBrackets: number[];
};

export type PhaseGuessingState = {
  presenterId: UID;
  turnOrder: GameOrder;
  secretWordId: UID;
  wordsDict: Dictionary<TextCard>;
  poolIds: UID[];
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<string, number>;
  pointsBrackets: number[];
};

export type PhaseResultsState = {
  presenterId: UID;
  turnOrder: GameOrder;
  result: GalleryEntry;
  ranking: GameRanking;
};
