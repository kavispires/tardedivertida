// Types
import type { TextCardData } from '../../types/tdr';
import type { CRUZA_PALAVRAS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `cruza-palavras` session.
 */
export type CruzaPalavrasOptions = {
  /**
   * Adds a row and column to the grid
   */
  largerGrid: boolean;
  /**
   * Determines the source of the grid headers
   */
  gridType: 'words' | 'properties' | 'contenders' | 'imageCards' | 'items';
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
} & ContendersDecksOptions;

/**
 * A text resource optionally annotated with its source category.
 */
export type TextCardWithType = TextCardData & {
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type?: string;
};

/**
 * The ordered collection of cards available for this game.
 */
export type Deck = TextCardWithType[];

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: Deck;
};

/**
 * Previously submitted clues grouped by their associated word pair or coordinate.
 */
export type PastClues = Dictionary<string[]>;

/**
 * A player's clue for an assigned grid coordinate.
 */
export type ClueEntry = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
  /**
   * The grid coordinate assigned to this clue.
   */
  coordinate: number;
};

/**
 * A grid cell with coordinate labels, ownership, and writing availability.
 */
export type GridCell = {
  /**
   * The position of this entry in its grid or ordered collection.
   */
  index: number;
  /**
   * The grid-cell category used to distinguish labels and playable cells.
   */
  kind: string;
  /**
   * The text displayed for this card or entry.
   */
  text: string;
  /**
   * Whether this cell can currently be selected.
   */
  available: boolean;
  /**
   * Unique identifier of this game entry.
   */
  id?: string;
  /**
   * The horizontal grid coordinate.
   */
  x?: number;
  /**
   * The vertical grid coordinate.
   */
  y?: number;
  /**
   * The word labeling the cell's horizontal coordinate.
   */
  xText?: string;
  /**
   * The word labeling the cell's vertical coordinate.
   */
  yText?: string;
  /**
   * Whether a player may currently submit a clue for this cell.
   */
  writable?: boolean;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId?: string | null;
};

/**
 * Server-side data retained between phases of a `cruza-palavras` session.
 */
export interface CruzaPalavrasStore extends DefaultStore<CruzaPalavrasOptions> {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: Deck;
  /**
   * Previously submitted clues retained for later rounds or persistence.
   */
  pastClues: PastClues;
}

/**
 * Public game state shared with players during a `cruza-palavras` session.
 */
export interface CruzaPalavrasState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `cruza-palavras` session.
 */
export interface CruzaPalavrasInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: CruzaPalavrasStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: CruzaPalavrasState;
}

/**
 * Player action payload accepted by the `cruza-palavras` engine.
 */
export interface CruzaPalavrasSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof CRUZA_PALAVRAS_ACTIONS;
}

/**
 * Firestore document data used when reading the `cruza-palavras` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & CruzaPalavrasState;
/**
 * Firestore document data used when reading the `cruza-palavras` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & CruzaPalavrasStore;
