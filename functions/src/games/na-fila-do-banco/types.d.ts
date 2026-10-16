// Types
import type { NA_FILA_DO_BANCO_ACTIONS } from './constants';

/**
 * A bank customer card with its owner, character type, image, and color.
 */
export interface ClientCard {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifier of the image used to display this entry.
   */
  imageId: string;
  /**
   * The display or card-matching color assigned to this entry.
   */
  color: string;
}

/**
 * A bank teller with queue capacity, scoring modifiers, and the last resolved event.
 */
export interface Teller {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * Identifier of the image used to display this entry.
   */
  imageId: string;
  /**
   * The queue capacities applied during teller resolution.
   */
  capacity: number[];
  /**
   * Customer types that receive a scoring multiplier at this teller.
   */
  doublers: string[];
  /**
   * Customer card identifiers in their current queue order.
   */
  queue: string[];
  /**
   * The most recent teller event and the queue snapshot from before it.
   */
  lastEvent: {
    /**
     * Identifier of the resolved teller event.
     */
    eventId: string;
    /**
     * Identifier of the card the player chose to play.
     */
    playedCardId: string;
    /**
     * The teller effect applied by the played card.
     */
    effectType: string;
    // ADD THIS: The snapshot of the queue right before this event
    /**
     * Customer card identifiers in queue order immediately before the event.
     */
    queueBeforeEvent: string[]; // (e.g., ['A', 'B'])
  } | null;
}

/**
 * Server-side data retained between phases of a `na-fila-do-banco` session.
 */
export interface NaFilaDoBancoStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `na-fila-do-banco` session.
 */
export interface NaFilaDoBancoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `na-fila-do-banco` session.
 */
export interface NaFilaDoBancoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: NaFilaDoBancoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: NaFilaDoBancoState;
}

/**
 * Player action payload accepted by the `na-fila-do-banco` engine.
 */
export interface NaFilaDoBancoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof NA_FILA_DO_BANCO_ACTIONS;
}

/**
 * Firestore document data used when reading the `na-fila-do-banco` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & NaFilaDoBancoState;
/**
 * Firestore document data used when reading the `na-fila-do-banco` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & NaFilaDoBancoStore;
