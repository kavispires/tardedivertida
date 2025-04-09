// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';

export type SubmitCardPayload = {
  cardId: string;
  targetId: string;
};

export type RunnerCard = {
  id: CardId;
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
  cardId: CardId;
  playerId: PlayerId;
  targetId: PlayerId;
  newValue?: number;
  startingPositions: {
    [key: string]: number;
  };
  endingPositions: {
    [key: string]: number;
  };
  ongoingEffectCardId?: CardId;
};

export type PhaseCardSelectionState = {
  cardsDict: Dictionary<RunnerCard>;
  turnOrder: PlayerId[];
  race: RunActivity[];
};

export type PhaseRunState = {
  cardsDict: Dictionary<RunnerCard>;
  turnOrder: PlayerId[];
  race: RunActivity[];
  ranking: GameRanking;
  lockedPlayersIds: PlayerId[];
  ongoingPlusOnePlayersIds: PlayerId[];
  ongoingMinusOnePlayersIds: PlayerId[];
};

export type PhaseGameOverState = {
  cardsDict: Dictionary<RunnerCard>;
  replay: RunActivity[];
  achievements: Achievement[];
};
