// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';
import type { GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';

export type SubmitCategoryPayload = {
  category: string;
};

export type SubmitSkipTurnPayload = never;

export type SubmitCardsPayload = {
  cardsIds: CardId[];
};

export type SubmitEvaluationsPayload = {
  evaluations: Dictionary<boolean>;
};

export type TableEntry = {
  playerId: PlayerId;
  cardId: CardId;
  accepted: boolean;
};

export type GalleryEntry = {
  category: string;
  creatorId: PlayerId;
  items: TableEntry[];
};

export type PhaseCategoryCreationState = {
  turnOrder: GameOrder;
  creatorId: PlayerId;
  cardsDict: Dictionary<Item>;
};

export type PhaseSkipAnnouncementState = {
  turnOrder: GameOrder;
  creatorId: PlayerId;
  cardsDict: Dictionary<Item>;
};

export type PhaseCardPlayState = {
  turnOrder: GameOrder;
  creatorId: PlayerId;
  cardsDict: Dictionary<Item>;
  category: string;
};

export type PhaseVerificationState = {
  turnOrder: GameOrder;
  creatorId: PlayerId;
  cardsDict: Dictionary<Item>;
  table: TableEntry[];
  category: string;
};

export type PhaseResultsState = {
  turnOrder: GameOrder;
  creatorId: PlayerId;
  cardsDict: Dictionary<Item>;
  table: TableEntry[];
  ranking: GameRanking;
  category: string;
  creatorBonus?: boolean;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  winners: GamePlayer[];
  gallery: GalleryEntry[];
  cardsDict: Dictionary<Item>;
};
