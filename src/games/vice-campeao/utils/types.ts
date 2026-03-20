// Types
import type { Achievement, GameRanking } from 'types/game';

export type SubmitCardPayload = {
  cardId: string;
  targetId: string;
};

export type RunnerCard = {
  id: UID;
  imageId: string;
  name: DualLanguageValue;
  type: 'movement-positive' | 'movement-negative' | 'movement-neutral' | 'ongoing' | 'effect';
  quantity: number;
  description?: DualLanguageValue;
  value?: number;
  triggerKey?: string;
  noTarget?: boolean;
};

export type RunActivity = {
  id: number; // index
  cardId: UID;
  playerId: UID;
  targetId: UID;
  newValue?: number;
  startingPositions: {
    [key: string]: number;
  };
  endingPositions: {
    [key: string]: number;
  };
  ongoingEffectCardId?: UID;
};

export type PhaseCardSelectionState = {
  cardsDict: Dictionary<RunnerCard>;
  turnOrder: UID[];
  race: RunActivity[];
};

export type PhaseRunState = {
  cardsDict: Dictionary<RunnerCard>;
  turnOrder: UID[];
  race: RunActivity[];
  ranking: GameRanking;
  lockedPlayersIds: UID[];
  ongoingPlusOnePlayersIds: UID[];
  ongoingMinusOnePlayersIds: UID[];
};

export type PhaseGameOverState = {
  cardsDict: Dictionary<RunnerCard>;
  replay: RunActivity[];
  achievements: Achievement[];
};
