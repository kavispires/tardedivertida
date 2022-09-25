import { TREVO_DA_SORTE_ACTIONS } from './constants';

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
  tries?: number;
  score?: number;
}

export interface GuessPayload {
  A: LeafGuess;
  B: LeafGuess;
  C: LeafGuess;
  D: LeafGuess;
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

type Leaves = Record<LeafId, Leaf>;

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
  action: keyof typeof TREVO_DA_SORTE_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & TrevoDaSorteState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & TrevoDaSorteStore;
