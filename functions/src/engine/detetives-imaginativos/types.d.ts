import { DETETIVES_IMAGINATIVOS_ACTIONS } from './constants';

export interface DetetivesImaginativosOptions {}

export interface ResourceData {
  cards: ImageCardId[];
}

export interface UsedCards {
  cards: ImageCardId[];
  clue: string;
  playerId: PlayerId;
  isLeader: boolean;
}

export interface TableEntry {
  playerId: PlayerId;
  cards: ImageCardId[];
}

export interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: UsedCards[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

export interface DetetivesImaginativosState extends DefaultState {
  leaderId?: PlayerId;
  impostorId?: PlayerId;
  phaseOrder?: PlayerId[];
  phaseIndex?: number;
  currentPlayerId?: PlayerId;
  table?: TableEntry;
  ranking?: any;
  impostorVotes?: any;
  winners?: any;
  [key: string]: any;
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
