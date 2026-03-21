import type { NA_FILA_DO_BANCO_ACTIONS } from './constants';

export interface ClientCard {
  id: string;
  type: string;
  playerId: UID;
  imageId: string;
  color: string;
}

export interface Teller {
  id: string;
  type: string;
  imageId: string;
  capacity: number[];
  doublers: string[];
  previousQueue: string[];
  queue: string[];
  nextQueue: string[];
}

export interface NaFilaDoBancoStore extends DefaultStore {
  [key: string]: any;
}

export interface NaFilaDoBancoState extends DefaultState {
  [key: string]: any;
}

export interface NaFilaDoBancoInitialState extends InitialState {
  store: NaFilaDoBancoStore;
  state: NaFilaDoBancoState;
}

export interface NaFilaDoBancoSubmitAction extends Payload {
  action: keyof typeof NA_FILA_DO_BANCO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & NaFilaDoBancoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & NaFilaDoBancoStore;
