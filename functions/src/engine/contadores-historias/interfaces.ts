import { ImageCard, Language, Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export interface ContadoresHistoriasStore {
  language: Language;
  gameOrder: PlayerId[];
  tableDeck: ImageCard[];
  deckIndex: number;
  [key: string]: any;
}

export interface ContadoresHistoriasState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export interface ContadoresHistoriasInitialState {
  meta: Meta;
  players: Players;
  store: ContadoresHistoriasStore;
  state: ContadoresHistoriasState;
}

export interface TableEntry {
  cardId: ImageCard;
  playerId: PlayerId;
  votes: PlayerId[];
  isSolution: boolean;
}

export type Table = TableEntry[];

export interface ContadoresHistoriasSubmitAction extends Payload {
  action: 'SUBMIT_STORY' | 'PLAY_CARD' | 'SUBMIT_VOTE';
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
