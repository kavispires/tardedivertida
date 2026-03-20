// Types
import type { Achievement } from 'types/game';
// Internal
import type { CARD_TYPES, OUTCOME } from './constants';

export type DataCounts = {
  agents: number;
  terrorists: number;
  bomb: number;
  wires: number;
  blank: number;
};

export type Declaration = {
  playerId: UID;
  bombs: number;
  wires: number;
};

export type TimeBombCard = {
  id: UID;
  type: (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
};

export type Target = {
  playerId: UID;
  playerIndex: number;
  targetCard: TimeBombCard;
  targetCardIndex: number;
};

export type Status = {
  activePlayerIds: Dictionary<UID | null>; // when more than 1 value, last is target, and second to last is active
  cut: Dictionary<TimeBombCard>;
  revealed: number;
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME];
  updatedAt: number;
};

export type SubmitDeclarationPayload = {
  declarations: Declaration;
};

export type UpdateTargetPlayerPayload = {
  targetPlayerId: UID;
};

export type SubmitTargetPayload = {
  target: Target;
};

export type PhaseDeclarationState = {
  dataCounts: DataCounts;
  status: Status;
};

export type PhaseExaminationState = {
  dataCounts: DataCounts;
  status: Status;
  currentTargetPlayerId?: UID;
};

export type PhaseGameOverState = {
  dataCounts: DataCounts;
  status: Status;
  achievements: Achievement[];
};
