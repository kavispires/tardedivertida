// Types
import type { QUEM_NAO_MATA_ACTIONS } from './constants';

/**
 * Server-side data retained between phases of a `quem-nao-mata` session.
 */
export interface QuemNaoMataStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `quem-nao-mata` session.
 */
export interface QuemNaoMataState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `quem-nao-mata` session.
 */
export interface QuemNaoMataInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: QuemNaoMataStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: QuemNaoMataState;
}

/**
 * Player action payload accepted by the `quem-nao-mata` engine.
 */
export interface NaRuaDoMedoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof QUEM_NAO_MATA_ACTIONS;
}

/**
 * Firestore document data used when reading the `quem-nao-mata` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemNaoMataState;
/**
 * Firestore document data used when reading the `quem-nao-mata` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemNaoMataStore;
