// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type Point = { x: number; y: number };

export type PieceData = {
  id: number;
};

export type GridState = (PieceData | null)[];

export type ActiveDrag = {
  pieceId: number;
  originIndex: number;
  groupIndices: number[];
} | null;

export type DailyVitraisEntry = {
  id: string;
  number: number;
  type: 'vitrais';
  title: string;
  cardId: string;
  pieces: number[]; // shuffled array of pieces ids. Each id is composed of a number that represents the piece index (0-N) of the puzzle in the correct order
};

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  timeElapsed: number;
  piecesOrder: number[];
  score: number;
};

export type SessionState = {
  grid: GridState; // pieceId -> {x, y}
  justDroppedIds: number[];
  activeDrag: ActiveDrag;
};
