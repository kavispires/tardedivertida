export type CruzaPalavrasOptions = {
  largerGrid: boolean;
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
  action: 'SUBMIT_CLUE' | 'SUBMIT_GUESSES';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;
