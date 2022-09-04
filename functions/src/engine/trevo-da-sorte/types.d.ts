export type TrevoDaSorteOptions = {
  hardGame: boolean;
};

export interface AllWords {
  [key: string]: TextCard;
}

type Position = 'A' | 'B' | 'C' | 'D';

type LeafId = string;

export interface Leaf {
  id: LeafId;
  cards: TextCard[];
  rotation: number;
  position: Position | null;
}

export interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  position?: Position;
}

export interface Clover {
  clues?: string[];
  rotation: number;
  leaves: {
    A: LeafId;
    B: LeafId;
    C: LeafId;
    D: LeafId;
  };
  guess: {
    A: LeafGuess | null;
    B: LeafGuess | null;
    C: LeafGuess | null;
    D: LeafGuess | null;
  };
  tries: number;
}

export interface TrevoDaSorteStore extends DefaultStore {
  [key: string]: any;
}

export interface TrevoDaSorteState extends DefaultState {
  gameOrder: PlayerId[];
  controllerId?: PlayerId;

  [key: string]: any;
}

export interface TrevoDaSorteInitialState extends InitialState {
  store: TrevoDaSorteStore;
  state: TrevoDaSorteState;
}

export interface TrevoDaSorteSubmitAction extends Payload {
  action: 'SUBMIT_BAD_WORDS' | 'SUBMIT_CLUES' | 'SUBMIT_GUESS' | 'UPDATE_CLOVER_STATE';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TrevoDaSorteState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TrevoDaSorteStore;
