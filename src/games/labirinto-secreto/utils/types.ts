// Types
import type { GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

export type SubmitMapPayload = {
  newMap: (TextCard | null)[];
};

export type OnSubmitMapFunction = (payload: SubmitMapPayload) => void;

export type SubmitPathGuessPayload = {
  pathId: UID;
  guess: TreeId[];
  choseRandomly: boolean;
};

export type OnSubmitPathGuessFunction = (payload: SubmitPathGuessPayload) => void;

export type TreeId = number;

export type Point = [number, number];

export type ExtendedTextCard = {
  negate?: boolean;
} & TextCard;

export interface Tree {
  /**
   * Forest segment id/index
   */
  id: TreeId;
  /**
   * The tree picture (a string means an itemId)
   */
  treeType: number | string;
  /**
   * Text card
   */
  card: TextCard;
  /**
   * Position in the forest
   */
  point: Point;
  /**
   * Whether the tree is blocked
   */
  blocked?: true;
}

export type Direction =
  | 'UP'
  | 'RIGHT'
  | 'DOWN'
  | 'LEFT'
  | 'UP_LEFT'
  | 'UP_RIGHT'
  | 'DOWN_LEFT'
  | 'DOWN_RIGHT';

export interface MapSegment {
  /**
   * Player map index
   */
  index: number;
  /**
   * Player map segment belongs to
   */
  playerId: UID;
  /**
   * Equivalent Forest segment
   */
  treeId: TreeId;
  /**
   * Was segment discovered by a player
   */
  passed: boolean;
  /**
   * Is the segment active in the current round
   */
  active: boolean;
  /**
   * Points granted by the segment
   */
  score: number;
  /**
   * The tree before this one
   */
  previousTree: TreeId | null;
  /**
   * The tree after this one
   */
  nextTree: TreeId | null;
  /**
   * Direction of the next segment
   */
  direction: Direction | null;
  /**
   * Card ids attached to it by the user as clues
   */
  clues: ExtendedTextCard[];
  /**
   * List of players that are currently on this segment
   */
  playersIds: UID[];
}

export type PlayerMapping = Record<TreeId, UID[]>;

export type PhaseMapBuildingState = {
  forest: Tree[];
};

export type PhasePathFollowingState = {
  activePlayerId: UID;
  forest: Tree[];
  turnOrder: TurnOrder;
};

export type PhaseResultsState = {
  forest: Tree[];
  ranking: GameRanking;
};
