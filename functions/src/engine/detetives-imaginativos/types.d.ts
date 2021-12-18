import { DefaultState, DefaultStore, ImageCard, InitialState, Payload, PlayerId } from '../../utils/types';

export interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: ImageCard[];
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
  action: 'SUBMIT_CLUE' | 'PLAY_CARD' | 'DEFEND' | 'SUBMIT_VOTE';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;
