import type { Dictionary } from 'lodash';
import type { BOMBA_RELOGIO_ACHIEVEMENTS, BOMBA_RELOGIO_ACTIONS, CARD_TYPES, OUTCOME } from './constants';

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
  id: string;
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

export type BombaRelogioAchievement = keyof typeof BOMBA_RELOGIO_ACHIEVEMENTS;

export interface BombaRelogioStore extends DefaultStore<unknown> {
  deck: TimeBombCard[];
}

export interface BombaRelogioState extends DefaultState {
  [key: string]: unknown;
}

export interface BombaRelogioInitialState extends InitialState {
  store: BombaRelogioStore;
  state: BombaRelogioState;
}

export interface BombaRelogioSubmitAction extends Payload {
  action: keyof typeof BOMBA_RELOGIO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & BombaRelogioState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & BombaRelogioStore;
