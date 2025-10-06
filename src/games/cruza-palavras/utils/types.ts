// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';
import type { GamePlayer } from 'types/player';
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

export type PlayerCoordinate = {
  coordinate: number;
  x: number;
  y: number;
  used: boolean;
};

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

export type PhaseWordsSelectionState = {
  deck: TextCardWithType[];
  gameType: GridType;
  gridSize: number;
};

export type PhaseClueWritingState = {
  gameType: GridType;
  grid: Grid;
  gridSize: number;
};

export type PhaseGuessingState = {
  clues: Clue[];
  gameType: GridType;
  grid: Grid;
  gridSize: number;
};

export type PhaseRevealState = {
  clues: Clue[];
  gameType: GridType;
  grid: Grid;
  gridSize: number;
  ranking: GameRanking;
  whoGotNoPoints: PlayerId[];
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  gameType: GridType;
  grid: Grid;
  gridSize: number;
  winners: GamePlayer[];
};
