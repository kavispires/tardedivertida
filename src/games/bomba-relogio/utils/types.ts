// Internal
import type { CARD_TYPES, OUTCOME } from './constants';

export type DataCount = {
  agents: number;
  terrorists: number;
  bomb: number;
  wires: number;
  blank: number;
};

export type Declaration = {
  playerId: PlayerId;
  bombs: number;
  wires: number;
};

export type TimeBombCard = {
  id: CardId;
  type: (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
};

export type Target = {
  playerId: PlayerId;
  playerIndex: number;
  targetCard: TimeBombCard;
  targetCardIndex: number;
};

export type Status = {
  activePlayerIds: Dictionary<PlayerId>; // when more than 1 value, last is target, and second to last is active
  cut: Dictionary<TimeBombCard>;
  revealed: number;
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME];
  updatedAt: number;
};

export type SubmitDeclarationPayload = {
  declarations: Declaration;
};

export type UpdateTargetPlayerPayload = {
  targetPlayerId: PlayerId;
};

export type SubmitTargetPayload = {
  target: Target;
};

export type PhaseDeclarationState = {
  dataCount: DataCount;
  status: Status;
};

export type PhaseExaminationState = {
  dataCount: DataCount;
  status: Status;
  currentTargetPlayerId?: PlayerId;
};

export type PhaseGameOverState = {
  dataCount: DataCount;
  status: Status;
};

export type PhaseTemplateState = {
  something: string;
};
