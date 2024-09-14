// Types
import { TextCard } from 'types/tdr';

export type SubmitBadWordsPayload = {
  cardsIds: CardId[];
};

export type SubmitCluesPayload = {
  clues: string[];
  rotations: NumberDictionary;
};

export type SubmitCloverGuessesPayload = {
  activeCloverId: PlayerId;
  guesses: Guesses;
};

export type UpdateCoverStatePayload = {
  change: Record<string, any>;
};

export type LeafIndex = 0 | 1 | 2 | 3;

export type LeafPosition = 'A' | 'B' | 'C' | 'D';

export type LeafId = string;

export type LeafEvent = (e: ButtonEvent, leafId: LeafId) => void;

export interface CloverLeaf {
  leafId: LeafId;
  rotation: number;
  clue: string;
}

export interface CloverObject {
  cloverId: PlayerId;
  leaves: {
    A: CloverLeaf;
    B: CloverLeaf;
    C: CloverLeaf;
    D: CloverLeaf;
  };
}

export interface LeafEntry {
  id: LeafId;
  cards: TextCard[];
}

export type Leaves = Record<LeafId, LeafEntry>;

export interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  tries?: number;
  score?: number;
}

export type LeafLocks = Record<LeafPosition, boolean>;

export type Guesses = Record<LeafPosition, LeafGuess | null>;

export type CloverMode = 'write' | 'guess' | 'view' | 'result';
