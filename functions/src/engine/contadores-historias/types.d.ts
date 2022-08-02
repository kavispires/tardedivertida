export type ContadoresHistoriasOptions = {
  fixedRounds: boolean;
};

export interface ContadoresHistoriasStore extends DefaultStore {
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
  action: 'SUBMIT_STORY' | 'PLAY_CARD' | 'SUBMIT_VOTE';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
