// Types
import type { CONTADORES_HISTORIAS_ACTIONS } from './constants';

export type ContadoresHistoriasOptions = {
  /**
   * Each player goes one or twice
   */
  fixedRounds: boolean;
};

export interface ResourceData {
  cards: UID[];
}

export interface ContadoresHistoriasStore extends DefaultStore {
  options: ContadoresHistoriasOptions;
  gameOrder: UID[];
  tableDeck: UID[];
  deckIndex: number;
  solutionCardId?: string;
  story?: string;
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ContadoresHistoriasState extends DefaultState {
  storytellerId?: UID;
  nextStorytellerId?: UID;
  story?: string;
  table?: any;
  outcome?: any;
  ranking?: any;
  winners?: any;
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ContadoresHistoriasInitialState extends InitialState {
  store: ContadoresHistoriasStore;
  state: ContadoresHistoriasState;
}

export interface TableEntry {
  cardId: UID;
  playerId: UID;
  votes: UID[];
  isSolution: boolean;
}

export type Table = TableEntry[];

export interface ContadoresHistoriasSubmitAction extends Payload {
  action: keyof typeof CONTADORES_HISTORIAS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
