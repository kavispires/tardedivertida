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

// export type ActivePiece = Piece & {
//   currentPos: { x: number; y: number };
//   isLocked: boolean;
//   // We need helper coordinates derived from 'correctPos' (index)
//   gridX: number;
//   gridY: number;
// };
