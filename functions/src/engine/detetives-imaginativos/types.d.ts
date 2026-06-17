import type { DETETIVES_IMAGINATIVOS_ACTIONS } from './constants';

export interface ResourceData {
  cards: UID[];
}

export interface UsedCards {
  cards: UID[];
  clue: string;
  playerId: UID;
  isLeader: boolean;
}

export interface TableEntry {
  playerId: UID;
  cards: UID[];
}

export interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: UsedCards[];
  gameOrder: UID[];
  turnOrder: UID[];
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface DetetivesImaginativosState extends DefaultState {
  leaderId?: UID;
  impostorId?: UID;
  phaseOrder?: UID[];
  phaseIndex?: number;
  currentPlayerId?: UID;
  table?: TableEntry;
  impostorVotes?: number;
  winners?: Player[];
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface DetetivesImaginativosInitialState extends InitialState {
  store: DetetivesImaginativosStore;
  state: DetetivesImaginativosState;
}

export interface DetetivesImaginativosSubmitAction extends Payload {
  action: keyof typeof DETETIVES_IMAGINATIVOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;
