type SubmitBadWordsPayload = {
  cardsIds: CardId[];
};

type SubmitCluesPayload = {
  clues: string[];
};

type SubmitGuessPayload = {
  guess: any;
};

type UpdateCoverStatePayload = {
  change: Record<string, any>;
};

type LeafIndex = 0 | 1 | 2 | 3;

type LeafPosition = 'A' | 'B' | 'C' | 'D';

type LeafId = string;

interface Leaf {
  id: LeafId;
  cards: DefaultTextCard[];
  rotation: number;
  position: Position | null;
}

type Leaves = Record<LeafId, Leaf>;

interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  position?: Position;
}

type YGuesses = Record<LeafPosition, LeafGuess | null>;

type CloverMode = 'write' | 'guess' | 'result';

interface Clover {
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
