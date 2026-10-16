// Types
import type { DETETIVES_IMAGINATIVOS_ACTIONS } from './constants';

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: UID[];
}

/**
 * Card resources recorded as used during the game.
 */
export interface UsedCards {
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: UID[];
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Whether the recorded cards belong to the round leader.
   */
  isLeader: boolean;
}

/**
 * A player-associated table submission and its evaluation or voting data.
 */
export interface TableEntry {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: UID[];
}

/**
 * Server-side data retained between phases of a `detetives-imaginativos` session.
 */
export interface DetetivesImaginativosStore extends DefaultStore {
  /**
   * Cards already used and retained for history or resource tracking.
   */
  usedCards: UsedCards[];
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: UID[];
  /**
   * Player identifiers in the order used for turns.
   */
  turnOrder: UID[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `detetives-imaginativos` session.
 */
export interface DetetivesImaginativosState extends DefaultState {
  /**
   * Identifier of the current detective leader.
   */
  leaderId?: UID;
  /**
   * Identifier of the player assigned the impostor role.
   */
  impostorId?: UID;
  /**
   * Player identifiers in the order used during the current phase.
   */
  phaseOrder?: UID[];
  /**
   * The current position within the phase's player order.
   */
  phaseIndex?: number;
  /**
   * Identifier of the player currently expected to act.
   */
  currentPlayerId?: UID;
  /**
   * The table submissions currently available for evaluation.
   */
  table?: TableEntry;
  /**
   * The number of votes identifying the impostor.
   */
  impostorVotes?: number;
  /**
   * Players or player identifiers selected as winners.
   */
  winners?: Player[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `detetives-imaginativos` session.
 */
export interface DetetivesImaginativosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: DetetivesImaginativosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: DetetivesImaginativosState;
}

/**
 * Player action payload accepted by the `detetives-imaginativos` engine.
 */
export interface DetetivesImaginativosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof DETETIVES_IMAGINATIVOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `detetives-imaginativos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
/**
 * Firestore document data used when reading the `detetives-imaginativos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;
