// Types
import type { COMUNICACAO_DUO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `comunicacao-duo` session.
 */
export type ComunicacaoDuoOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * The resource category used to populate the delivery board.
   */
  deckType: 'items' | 'images' | 'contenders' | 'suspects' | 'words';
  /**
   * Whether clues use the alien-symbol keyboard or free text.
   */
  clueInputType: 'alien-keyboard' | 'text';
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: DeckEntry[];
};

/**
 * A delivery-board entry with side affiliations, reveal status, and resource data.
 */
export type DeckEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The entry's hidden affiliation for each of the two sides.
   */
  affiliation: [string, string];
  /**
   * The entry's current delivery or reveal status.
   */
  status: string;
  /**
   * Resource or variant-specific data used to render and resolve the entry.
   */
  data: any;
  /**
   * Identifiers of players who delivered this entry.
   */
  deliveredBy?: UID[];
};

/**
 * A recorded action or resolved step retained for later evaluation.
 */
export type HistoryEntry = {
  /**
   * Identifier of the player who issued the delivery request.
   */
  requesterId: UID;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
  /**
   * The number of entries requested by this clue.
   */
  quantity: number;
  /**
   * Identifiers of the entries selected for delivery.
   */
  deliverables: string[];
};

/**
 * Remaining delivery targets overall and for each side.
 */
export type Summary = {
  /**
   * The total number of delivery targets still outstanding.
   */
  deliverablesLeft: number;
  /**
   * The number of delivery targets still outstanding for side A.
   */
  deliverablesLeftForA: number;
  /**
   * The number of delivery targets still outstanding for side B.
   */
  deliverablesLeftForB: number;
};

/**
 * Server-side data retained between phases of a `comunicacao-duo` session.
 */
export interface ComunicacaoDuoStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `comunicacao-duo` session.
 */
export interface ComunicacaoDuoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `comunicacao-duo` session.
 */
export interface ComunicacaoDuoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ComunicacaoDuoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ComunicacaoDuoState;
}

/**
 * Player action payload accepted by the `comunicacao-duo` engine.
 */
export interface ComunicacaoDuoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof COMUNICACAO_DUO_ACTIONS;
}

/**
 * Firestore document data used when reading the `comunicacao-duo` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | ComunicacaoDuoState;
/**
 * Firestore document data used when reading the `comunicacao-duo` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ComunicacaoDuoStore;
