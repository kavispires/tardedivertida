import {
  DefaultState,
  DefaultStore,
  ImageCard,
  InitialState,
  Payload,
  PlayerId,
} from '../../utils/interfaces';

export interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: ImageCard[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

export interface DetetivesImaginativosState extends DefaultState {
  [key: string]: any;
}

export interface DetetivesImaginativosInitialState extends InitialState {
  store: DetetivesImaginativosStore;
  state: DetetivesImaginativosState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;

export interface DetetivesImaginativosSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'PLAY_CARD' | 'DEFEND' | 'SUBMIT_VOTE';
}
