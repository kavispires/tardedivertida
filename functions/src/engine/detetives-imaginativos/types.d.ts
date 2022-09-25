import { DETETIVES_IMAGINATIVOS_ACTIONS } from './constants';

export interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: ImageCardId[];
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
  table?: any;
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
