// Types
import type { GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

export type SubmitPoolPayload = {
  poolIds: CardId[];
  secretWordId: CardId;
};

export type SubmitMetricsPayload = {
  metrics: Record<string, number>;
};

export type SubmitGuessPayload = {
  guesses: Guess[];
};

export type Guess = {
  cardId: CardId;
  level: number;
  timestamp: number;
  playerId?: PlayerId;
  score?: number;
  used?: boolean;
  retry?: boolean;
};

export type GalleryBracket = {
  score: number;
  playersIds: PlayerId[];
  wrongGuesses: {
    playerId: PlayerId;
    cardId: CardId;
    invalid?: boolean;
  }[];
};

export type GalleryEntry = {
  secretWordId: CardId;
  cards: Record<CardId, TextCard>;
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<CardId, number>;
  brackets: GalleryBracket[];
};

export type PhaseMetricsBuildingState = {
  presenterId: PlayerId;
  turnOrder: GameOrder;
  wordsDict: Dictionary<TextCard>;
  secretCardsOptionsIds: CardId[];
  availablePoolCardsIds: CardId[];
  poolIds?: CardId[];
  secretWordId?: CardId;
  metricsDescriptors: Record<string, TextCard[]>;
  pointsBrackets: number[];
};

export type PhaseGuessingState = {
  presenterId: PlayerId;
  turnOrder: GameOrder;
  secretWordId: CardId;
  wordsDict: Dictionary<TextCard>;
  poolIds: CardId[];
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<string, number>;
  pointsBrackets: number[];
};

export type PhaseResultsState = {
  presenterId: PlayerId;
  turnOrder: GameOrder;
  result: GalleryEntry;
  ranking: GameRanking;
};
