// Types
import type { TextCardData } from '../../types/tdr';
import type { FILEIRA_DE_FATOS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `fileira-de-fatos` session.
 */
export type FileiraDeFatosOptions = {
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Scenario prompts available for ranking rounds.
   */
  scenarios: TextCardData[];
};

/**
 * Server-side data retained between phases of a `fileira-de-fatos` session.
 */
export interface FileiraDeFatosStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `fileira-de-fatos` session.
 */
export interface FileiraDeFatosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `fileira-de-fatos` session.
 */
export interface FileiraDeFatosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: FileiraDeFatosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: FileiraDeFatosState;
}

/**
 * Player action payload accepted by the `fileira-de-fatos` engine.
 */
export interface FileiraDeFatosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof FILEIRA_DE_FATOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `fileira-de-fatos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | FileiraDeFatosState;
/**
 * Firestore document data used when reading the `fileira-de-fatos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | FileiraDeFatosStore;
