// Types
import type { Achievement, GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

/**
 * Payload for submitting the player's map with clue cards
 */
export type SubmitMapPayload = {
  /**
   * Array of text cards or null values representing the new map segments
   */
  newMap: (TextCard | null)[];
};

/**
 * Function signature for submitting a player's map
 */
export type OnSubmitMapFunction = (payload: SubmitMapPayload) => void;

/**
 * Payload for submitting a path guess during the path following phase
 */
export type SubmitPathGuessPayload = {
  /**
   * Unique identifier of the path being guessed
   */
  pathId: UID;
  /**
   * Array of tree IDs representing the guessed path
   */
  guess: TreeId[];
  /**
   * Whether the player chose the path randomly
   */
  choseRandomly: boolean;
};

/**
 * Function signature for submitting a path guess
 */
export type OnSubmitPathGuessFunction = (payload: SubmitPathGuessPayload) => void;

/**
 * Unique identifier for a tree in the forest
 */
export type TreeId = number;

/**
 * Coordinate pair representing a position in the forest grid
 */
export type Point = [number, number];

/**
 * Extended text card with additional properties for negation
 */
export type ExtendedTextCard = {
  /**
   * Whether the card's meaning is negated
   */
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

/**
 * Direction of movement between trees in the forest
 */
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

/**
 * Mapping of tree IDs to arrays of player IDs currently at those trees
 */
export type PlayerMapping = Record<TreeId, UID[]>;

/**
 * State for the map building phase
 */
export type PhaseMapBuildingState = {
  /**
   * Array of trees representing the forest
   */
  forest: Tree[];
};

/**
 * State for the path following phase
 */
export type PhasePathFollowingState = {
  /**
   * ID of the player whose turn it currently is
   */
  activePlayerId: UID;
  /**
   * Array of trees representing the forest
   */
  forest: Tree[];
  /**
   * Order of player turns
   */
  turnOrder: TurnOrder;
};

/**
 * State for the results phase
 */
export type PhaseResultsState = {
  /**
   * Array of trees representing the forest
   */
  forest: Tree[];
  /**
   * Player ranking with scores and positions
   */
  ranking: GameRanking;
};

/**
 * State for the game over phase
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winner player IDs
   */
  winners: UID[];
  /**
   * List of achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Array of trees representing the forest
   */
  forest: Tree[];
};
