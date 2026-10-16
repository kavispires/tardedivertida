// Types
import type { ItemData } from '../../types/tdr';
import type { QUAL_QUESITO_ACTIONS, QUAL_QUESITO_PHASES } from './constants';

/**
 * Configuration options used when creating a `qual-quesito` session.
 */
export type QualQuesitoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Item resources available for game setup.
   */
  allItems: ItemData[];
};

/**
 * A player-associated table submission and its evaluation or voting data.
 */
export type TableEntry = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: UID;
  /**
   * Whether the submitted card was accepted into the category.
   */
  accepted: boolean;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * The category created for this group of items.
   */
  category: string;
  /**
   * Identifier of the player who created the category.
   */
  creatorId: UID;
  /**
   * The item resources associated with this game step.
   */
  items: TableEntry[];
};

/**
 * Phase identifiers supported by `qual-quesito`.
 */
export type QualQuesitoPhase = keyof typeof QUAL_QUESITO_PHASES;

/**
 * Server-side data retained between phases of a `qual-quesito` session.
 */
export interface QualQuesitoStore extends DefaultStore<QualQuesitoOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `qual-quesito` session.
 */
export interface QualQuesitoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `qual-quesito` session.
 */
export interface QualQuesitoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: QualQuesitoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: QualQuesitoState;
}

/**
 * Player action payload accepted by the `qual-quesito` engine.
 */
export interface QualQuesitoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof QUAL_QUESITO_ACTIONS;
}

/**
 * Firestore document data used when reading the `qual-quesito` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & QualQuesitoState;
/**
 * Firestore document data used when reading the `qual-quesito` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & QualQuesitoStore;
