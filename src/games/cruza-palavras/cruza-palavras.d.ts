type CruzaPalavrasClue = {
  coordinate: number;
  clue: string;
  playerId?: PlayerId;
};

type CruzaPalavrasGridCell = {
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

type CruzaPalavraGrid = CruzaPalavrasGridCell[];
