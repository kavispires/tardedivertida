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
  lockedRotation: number;
  position: Position | null;
  rotation: number;
}

export interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  position?: Position;
  score?: number;
}

export interface Guess {
  A: LeafGuess;
  B: LeafGuess;
  C: LeafGuess;
  D: LeafGuess;
}

export type Guesses = Record<PlayerId, Guess>;

export interface Clover {
  clues?: string[];
  rotation: number;
  leaves: {
    A: LeafId;
    B: LeafId;
    C: LeafId;
    D: LeafId;
  };
}

export interface TrevoDaSorteStore extends DefaultStore {
  [key: string]: any;
}

export interface TrevoDaSorteState extends DefaultState {
  gameOrder?: PlayerId[];

  [key: string]: any;
}

export interface TrevoDaSorteInitialState extends InitialState {
  store: TrevoDaSorteStore;
  state: TrevoDaSorteState;
}

export interface TrevoDaSorteSubmitAction extends Payload {
  action: 'SUBMIT_BAD_WORDS' | 'SUBMIT_CLUES' | 'SUBMIT_GUESS' | 'UPDATE_CLOVER_STATE';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & TrevoDaSorteState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & TrevoDaSorteStore;
