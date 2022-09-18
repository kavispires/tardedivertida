type SubmitBadWordsPayload = {
  cardsIds: CardId[];
};

type SubmitCluesPayload = {
  clues: string[];
};

type SubmitCloverGuessesPayload = {
  activeCloverId: PlayerId;
  guesses: YGuesses;
};

type UpdateCoverStatePayload = {
  change: Record<string, any>;
};

type LeafIndex = 0 | 1 | 2 | 3;

type LeafPosition = 'A' | 'B' | 'C' | 'D';

type LeafId = string;

type LeafEvent = (e: ButtonEvent, leafId: LeafId) => void;

interface CloverLeaf {
  leafId: LeafId;
  rotation: number;
  clue: string;
}

interface Clover {
  cloverId: PlayerId;
  leaves: {
    A: CloverLeaf;
    B: CloverLeaf;
    C: CloverLeaf;
    D: CloverLeaf;
  };
}

interface Leaf {
  id: LeafId;
  cards: TextCard[];
}

type Leaves = Record<LeafId, Leaf>;

interface LeafGuess {
  leafId: LeafId;
  rotation: number;
  tries: number;
}

type YGuesses = Record<LeafPosition, LeafGuess | null>;

type CloverMode = 'write' | 'guess' | 'view';
