type SubmitDreamsPayload = {
  dreams: PlainObject;
};

type SubmitVotesPayload = {
  votes: PlainObject;
};

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
