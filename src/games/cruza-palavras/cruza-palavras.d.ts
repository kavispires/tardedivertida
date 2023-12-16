type CruzaPalavrasClue = {
  coordinate: number;
  clue: string;
  playerId?: PlayerId;
};

type CruzaPalavrasGridCell = {
  id?: string;
  index: number;
  kind: string;
  text: string;
  available: boolean;
  writable?: boolean;
  playerId?: PlayerId | null;
  xText?: string;
  yText?: string;
  x?: number;
  y?: number;
};

type CruzaPalavrasGrid = CruzaPalavrasGridCell[];
type CruzaPalavrasGridType = 'words' | 'contenders' | 'images';

type SubmitWordsPayload = {
  words: string[];
};

type SubmitCluePayload = {
  clue: string;
  currentClueCoordinate: number;
};

type SubmitGuessesPayload = {
  guesses: PlainObject;
  choseRandomly: boolean;
};
