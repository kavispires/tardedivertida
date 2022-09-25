import { VENDAVAL_DE_PALPITE_ACTIONS } from './constants';

export type ResourceData = {
  words: TextCard[];
  categories: TextCard[];
};

export type ClueId = string;

export type Clue = {
  id: ClueId;
  playerId: PlayerId;
  clue: string;
  /**
   * Indicates if the boss has already evaluated this clue against the secret word
   */
  evaluation?: boolean;
  /**
   * Indicates if clue is a final guess
   */
  isGuess?: boolean;
  /**
   * Indicates if the boss has used help to reveal the resolution of this clue
   */
  isResolved?: boolean;
};

export type Clues = Record<ClueId, Clue>;

export type CurrentRound = number;

export type BoardEntry = {
  clues: ClueId[];
  evaluation?: number;
};

export type Board = Record<CurrentRound, BoardEntry>;

export interface VendavalDePalpiteStore extends DefaultStore {
  categories: TextCard[];
  words: TextCard[];
  [key: string]: any;
}

export interface VendavalDePalpiteState extends DefaultState {
  [key: string]: any;
}

export interface VendavalDePalpiteInitialState extends InitialState {
  store: VendavalDePalpiteStore;
  state: VendavalDePalpiteState;
}

export interface VendavalDePalpiteSubmitAction extends Payload {
  action: keyof typeof VENDAVAL_DE_PALPITE_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | VendavalDePalpiteState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | VendavalDePalpiteStore;
