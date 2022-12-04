import { CRUZA_PALAVRAS_ACTIONS } from './constants';

export type CruzaPalavrasOptions = {
  largerGrid: boolean;
  imageGrid: boolean;
};

export type AllWords = {
  [key: string]: TextCard;
};

export type ResourceData = {
  allWords: AllWords;
};

export type Deck = TextCard[];

export type ClueEntry = {
  playerId: PlayerId;
  clue: string;
  coordinate: number;
};

export type GridCell = {
  index: number;
  kind: string;
  text: string;
  available: boolean;
  id?: string;
  x?: number;
  y?: number;
  xText?: string;
  yText?: string;
  writable?: boolean;
  playerId?: string | null;
};

export interface CruzaPalavrasStore extends DefaultStore {
  deck?: Deck;
  [key: string]: any;
}

export interface CruzaPalavrasState extends DefaultState {
  [key: string]: any;
}

export interface CruzaPalavrasInitialState extends InitialState {
  store: CruzaPalavrasStore;
  state: CruzaPalavrasState;
}

export interface CruzaPalavrasSubmitAction extends Payload {
  action: keyof typeof CRUZA_PALAVRAS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;
