export type TrevoDaSorteOptions = {
  hardGame: boolean;
};

export interface AllWords {
  [key: string]: TextCard;
}

export type Position = 'A' | 'B' | 'C' | 'D';

type LeafId = string;

export interface CloverLeaf {
  leafId: LeafId;
  rotation: number;
  clue: string;
}

export interface Clover {
  cloverId: PlayerId;
  leaves: {
    A: CloverLeaf;
    B: CloverLeaf;
    C: CloverLeaf;
    D: CloverLeaf;
  };
}

export interface Leaf {
  id: LeafId;
  cards: TextCard[];
}

export interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  tries: number;
}

export interface Guess {
  cloverId: PlayerId;
  playerId: PlayerId;
  score: number;
  leaves: {
    A: LeafGuess;
    B: LeafGuess;
    C: LeafGuess;
    D: LeafGuess;
  };
}

export type Guesses = Record<PlayerId, Guess>;

// export interface Leaf {
//   id: LeafId;
//   cards: TextCard[];
//   lockedRotation: number;
//   position: Position | null;
//   rotation: number;
// }

type Leaves = Record<LeafId, Leaf>;

// export interface LeafGuess {
//   leafId: LeafId;
//   rotation: number;
//   position?: Position;
//   score?: number;
// }

// export interface Guess {
//   A: LeafGuess | null;
//   B: LeafGuess | null;
//   C: LeafGuess | null;
//   D: LeafGuess | null;
//   tries: number;
// }

// export type Guesses = Record<PlayerId, Guess>;

// export interface Clover {
//   clues?: string[];
//   rotation: number;
//   leaves: {
//     A: LeafId;
//     B: LeafId;
//     C: LeafId;
//     D: LeafId;
//   };
// }

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
