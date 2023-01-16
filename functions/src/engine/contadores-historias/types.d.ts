import { CONTADORES_HISTORIAS_ACHIEVEMENTS, CONTADORES_HISTORIAS_ACTIONS } from './constants';

export type ContadoresHistoriasOptions = {
  /**
   * Each player goes one or twice
   */
  fixedRounds: boolean;
  /**
   * Use original image decks only
   */
  originalDecks: boolean;
};

export interface ResourceData {
  cards: string[];
}

export interface ContadoresHistoriasStore extends DefaultStore {
  options: ContadoresHistoriasOptions;
  gameOrder: PlayerId[];
  tableDeck: ImageCardId[];
  deckIndex: number;
  solutionCardId?: string;
  story?: string;
  [key: string]: any;
}

export interface ContadoresHistoriasState extends DefaultState {
  storytellerId?: PlayerId;
  nextStorytellerId?: PlayerId;
  story?: string;
  table?: any;
  outcome?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

export interface ContadoresHistoriasInitialState extends InitialState {
  store: ContadoresHistoriasStore;
  state: ContadoresHistoriasState;
}

export interface TableEntry {
  cardId: ImageCardId;
  playerId: PlayerId;
  votes: PlayerId[];
  isSolution: boolean;
}

export type Table = TableEntry[];

export interface ContadoresHistoriasSubmitAction extends Payload {
  action: keyof typeof CONTADORES_HISTORIAS_ACTIONS;
}

export type ContadoresHistoriasAchievement = keyof typeof CONTADORES_HISTORIAS_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
