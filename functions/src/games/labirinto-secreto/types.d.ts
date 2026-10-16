// Types
import type { TextCardData } from '../../types/tdr';
import type { DIRECTIONS, LABIRINTO_SECRETO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `labirinto-secreto` session.
 */
export type LabirintoSecretoGameOptions = {
  /**
   * Shorter path with 5 instead of 10 trees
   */
  shortPath?: boolean;
  /**
   * Use items instead of trees
   */
  itemTreeType?: boolean;
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Include private Easter eggs trees (like Flávia or Maris)
   */
  includePrivateTrees?: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Text resources used to label forest locations.
   */
  forestCards: TextCardData[];
  /**
   * The complete card resources available for selection.
   */
  allCards: TextCardData[];
};

/**
 * The flattened index identifying a forest cell.
 */
type TreeId = number;
/**
 * A forest coordinate pair ordered as horizontal position followed by vertical position.
 */
export type Point = [number, number];

/**
 * A clue card optionally marked to negate its meaning.
 */
export type ExtendedTextCard = {
  /**
   * Whether this clue should be interpreted as a negation.
   */
  negate?: boolean;
} & TextCardData;

/**
 * A forest cell with its tree or item appearance and path-related state.
 */
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
  card: TextCardData;
  /**
   * Is the tree blocked (cannot be passed)
   */
  blocked?: true;
}

/**
 * A supported compass direction between forest cells.
 */
export type Direction = keyof typeof DIRECTIONS;

/**
 * One segment of a player's forest path with its clues, progress, and scoring.
 */
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
 * Server-side data retained between phases of a `labirinto-secreto` session.
 */
export interface LabirintoSecretoStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `labirinto-secreto` session.
 */
export interface LabirintoSecretoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Player data extended with `labirinto-secreto` submissions and progress.
 */
export interface LabirintoSecretoPlayer extends Player {
  /**
   * Voting data retained on this player record.
   */
  votes: any;
}

/**
 * Player records indexed by player identifier for `labirinto-secreto`.
 */
export type LabirintoSecretoPlayers = Record<UID, LabirintoSecretoPlayer>;

/**
 * The initial metadata, server-side store, and public state for a `labirinto-secreto` session.
 */
export interface LabirintoSecretoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: LabirintoSecretoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: LabirintoSecretoState;
}

/**
 * Player action payload accepted by the `labirinto-secreto` engine.
 */
export interface LabirintoSecretoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof LABIRINTO_SECRETO_ACTIONS;
}

/**
 * Firestore document data used when reading the `labirinto-secreto` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & LabirintoSecretoState;
/**
 * Firestore document data used when reading the `labirinto-secreto` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & LabirintoSecretoStore;
/**
 * Firestore document data used when reading `labirinto-secreto` player records.
 */
export type FirebasePlayersData = FirebaseFirestore.DocumentData & LabirintoSecretoPlayers;
