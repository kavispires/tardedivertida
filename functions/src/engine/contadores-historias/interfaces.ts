import {
  DefaultState,
  DefaultStore,
  ImageCard,
  InitialState,
  Payload,
  PlayerId,
} from '../../utils/interfaces';

export interface ContadoresHistoriasStore extends DefaultStore {
  gameOrder: PlayerId[];
  tableDeck: ImageCard[];
  deckIndex: number;
  [key: string]: any;
}

export interface ContadoresHistoriasState extends DefaultState {
  [key: string]: any;
}

export interface ContadoresHistoriasInitialState extends InitialState {
  store: ContadoresHistoriasStore;
  state: ContadoresHistoriasState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;

export interface TableEntry {
  cardId: ImageCard;
  playerId: PlayerId;
  votes: PlayerId[];
  isSolution: boolean;
}

export type Table = TableEntry[];

export interface ContadoresHistoriasSubmitAction extends Payload {
  action: 'SUBMIT_STORY' | 'PLAY_CARD' | 'SUBMIT_VOTE';
}
