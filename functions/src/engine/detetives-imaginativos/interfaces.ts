import { ImageCard, Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export interface DetetivesImaginativosStore {
  usedCards: ImageCard[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

export interface DetetivesImaginativosState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export interface DetetivesImaginativosInitialState {
  meta: Meta;
  players: Players;
  store: DetetivesImaginativosStore;
  state: DetetivesImaginativosState;
}

export interface DetetivesImaginativosSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'PLAY_CARD' | 'DEFEND' | 'SUBMIT_VOTE';
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;
