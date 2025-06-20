// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';

export type CardEntry = {
  playerId: PlayerId;
  cards: string[];
};

export type FinalGalleryEntry = {
  cards: ImageCardId[];
  clue: string;
  playerId: PlayerId;
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
  vote: PlayerId;
};

export type PhaseSecretClueState = {
  impostorId: PlayerId;
  leaderId: PlayerId;
  turnOrder: GameOrder;
};

export type PhaseCardPlayState = {
  clue: string;
  currentPlayerId: PlayerId;
  impostorId: PlayerId;
  leaderId: PlayerId;
  phaseIndex: number;
  phaseOrder: GameOrder;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseDefenseState = {
  clue: string;
  currentPlayerId: PlayerId;
  impostorId: PlayerId;
  leaderId: PlayerId;
  phaseIndex: number;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseVotingState = {
  clue: string;
  impostorId: PlayerId;
  leaderId: PlayerId;
  table: CardEntry[];
  turnOrder: GameOrder;
};

export type PhaseRevealState = {
  clue: string;
  impostorId: PlayerId;
  leaderId: PlayerId;
  table: CardEntry[];
  turnOrder: GameOrder;
  ranking: GameRanking;
  impostorVotes: number;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  gallery: FinalGalleryEntry[];
};
