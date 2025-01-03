// Types
import type { TextCard } from 'types/tdr';

export type Clue = {
  coordinate: number;
  clue: string;
  playerId?: PlayerId;
};

export type GridCell = {
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

export type Grid = GridCell[];
export type GridType = 'words' | 'contenders' | 'images' | 'items';

export type ResultPlayerCell = {
  playerId: PlayerId;
  isCorrect?: boolean;
  color?: string;
};

export type SubmitWordsPayload = {
  words: string[];
};

export type SubmitCluePayload = {
  clue: string;
  currentClueCoordinate: number;
};

export type SubmitGuessesPayload = {
  guesses: PlainObject;
  choseRandomly: boolean;
};

export type TextCardWithType = TextCard & { type?: string };
