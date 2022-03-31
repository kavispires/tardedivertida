type SubmitDreamPayload = {
  dream: string;
};

type SubmitVotesPayload = {
  votes: StringDictionary;
};

type SDream = {
  id: PlayerId;
  dream: string;
};

type SGalleryEntry = {
  playerId: PlayerId;
  dreamId: ImageCardId;
  dream: string;
  cards: {
    cardId: ImageCardId;
    votes: PlayerId[];
    isDream: boolean;
    isNightmare: boolean;
  }[];
};

// Deprecated

type SClue = {
  cardId: string;
  clue: string;
  playerId: PlayerId;
};

type STableEntry = {
  cardId: string;
  nightmares: PlayerId[];
  dreamer: PlayerId | null;
};

type STable = STableEntry[];

type STheme = {
  id: string;
  text: string;
  description: string;
};

type SResult = {
  correct: number;
  dreamGuesses: BooleanDictionary;
  nightmareHits: string[];
  playerId: PlayerId;
  previousScore: number;
  win: boolean;
};

type SResults = {
  [key: string]: SResult;
};
