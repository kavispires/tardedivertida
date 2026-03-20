// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { Item } from 'types/tdr';

export type SubmitCategoryPayload = {
  category: string;
};

export type SubmitSkipTurnPayload = never;

export type SubmitCardsPayload = {
  cardsIds: UID[];
};

export type SubmitEvaluationsPayload = {
  evaluations: Dictionary<boolean>;
};

export type TableEntry = {
  playerId: UID;
  cardId: UID;
  accepted: boolean;
};

export type GalleryEntry = {
  category: string;
  creatorId: UID;
  items: TableEntry[];
};

export type PhaseCategoryCreationState = {
  turnOrder: GameOrder;
  creatorId: UID;
  cardsDict: Dictionary<Item>;
};

export type PhaseSkipAnnouncementState = {
  turnOrder: GameOrder;
  creatorId: UID;
  cardsDict: Dictionary<Item>;
};

export type PhaseCardPlayState = {
  turnOrder: GameOrder;
  creatorId: UID;
  cardsDict: Dictionary<Item>;
  category: string;
};

export type PhaseVerificationState = {
  turnOrder: GameOrder;
  creatorId: UID;
  cardsDict: Dictionary<Item>;
  table: TableEntry[];
  category: string;
};

export type PhaseResultsState = {
  turnOrder: GameOrder;
  creatorId: UID;
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
