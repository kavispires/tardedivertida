// Types
import type { ItemData } from '../../types/tdr';
import type { METALINGUAGEM_ACTIONS, WORD_LENGTH_STATUS } from './constants';

/**
 * Configuration options used when creating a `metalinguagem` session.
 */
export type MetalinguagemOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The item resources associated with this game step.
   */
  items: ItemData[];
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * The item resources used to construct the submitted name.
   */
  itemsIds: ItemData[];
  /**
   * The proposed name for this item combination.
   */
  name: string;
  /**
   * Names submitted for the selected items.
   */
  names: string[];
  /**
   * Whether this entry was resolved correctly.
   */
  correct: boolean;
};

/**
 * A word-length category and its current availability status.
 */
export type WordLength = {
  /**
   * The number of letters represented by this category.
   */
  wordLength: number;
  /**
   * The classification of the submitted name's length.
   */
  status: keyof typeof WORD_LENGTH_STATUS;
};

/**
 * Server-side data retained between phases of a `metalinguagem` session.
 */
export interface MetalinguagemStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `metalinguagem` session.
 */
export interface MetalinguagemState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `metalinguagem` session.
 */
export interface MetalinguagemInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: MetalinguagemStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: MetalinguagemState;
}

/**
 * Player action payload accepted by the `metalinguagem` engine.
 */
export interface MetalinguagemSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof METALINGUAGEM_ACTIONS;
}

/**
 * Firestore document data used when reading the `metalinguagem` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | MetalinguagemState;
/**
 * Firestore document data used when reading the `metalinguagem` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MetalinguagemStore;
