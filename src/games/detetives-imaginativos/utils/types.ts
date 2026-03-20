// Types
import type { Achievement, GameRanking } from 'types/game';

export type CardEntry = {
  playerId: UID;
  cards: string[];
};

export type FinalGalleryEntry = {
  cards: UID[];
  clue: string;
  playerId: UID;
  isLeader: boolean;
};

export type SubmitSecretCluePayload = {
  clue: string;
};

export type SubmitPlayCardPayload = {
  cardId: string;
};

export type SubmitDefensePayload = {
  defenseTime: number;
};

export type SubmitVotePayload = {
  vote: UID;
};

export type PhaseSecretClueState = {
  impostorId: UID;
  leaderId: UID;
  turnOrder: GameOrder;
};

export type PhaseCardPlayState = {
  clue: string;
  currentPlayerId: UID;
  impostorId: UID;
  leaderId: UID;
  phaseIndex: number;
  phaseOrder: GameOrder;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseDefenseState = {
  clue: string;
  currentPlayerId: UID;
  impostorId: UID;
  leaderId: UID;
  phaseIndex: number;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseVotingState = {
  clue: string;
  impostorId: UID;
  leaderId: UID;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseRevealState = {
  clue: string;
  impostorId: UID;
  leaderId: UID;
  table: CardEntry[];
  turnOrder: GameOrder;
  ranking: GameRanking;
  impostorVotes: number;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  gallery: FinalGalleryEntry[];
};
