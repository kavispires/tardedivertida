// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type Point = { x: number; y: number };

export type Piece = {
  id: string;
  correctPos: number; // what grid index it belongs to
  shape: Point[];
};

export type PieceState = Point & {
  isLocked: boolean;
};

export type DailyVitraisEntry = {
  id: DateKey; // YYYY-MM-DD string
  number: number; // number of the puzzle, use 0
  type: 'vitrais';
  title: string;
  cardId: string; // the id of the card that will generate the imageUrl
  gridCols: number;
  gridRows: number;
  startingPieceId: string; // the piece that starts locked in place
  pieces: Piece[];
};

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  timeElapsed: number;
  lockedPieces: string[]; // piece ids
  score: number;
};

export type SessionState = {
  piecesState: Dictionary<PieceState>; // pieceId -> {x, y}
};

export type DailyVitraisEntryV2 = {
  id: DateKey; // YYYY-MM-DD string
  number: number; // number of the puzzle, use 0
  type: 'vitrais';
  title: string;
  cardId: string; // the id of the card that will generate the imageUrl
  pieces: number[]; // shuffled array of pieces ids. Total length 30, each id is composed of a number that represents the piece index (0-29) of the puzzle in the correct order
};
