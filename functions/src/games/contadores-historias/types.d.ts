// Types
import type { CONTADORES_HISTORIAS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `contadores-historias` session.
 */
export type ContadoresHistoriasOptions = {
  /**
   * Each player goes one or twice
   */
  fixedRounds: boolean;
};

/**
 * Image-card identifiers loaded for storytelling hands and table cards.
 */
export interface ResourceData {
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: UID[];
}

/**
 * Server-side data retained between phases of a `contadores-historias` session.
 */
export interface ContadoresHistoriasStore extends DefaultStore {
  /**
   * The selected storytelling game configuration.
   */
  options: ContadoresHistoriasOptions;
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: UID[];
  /**
   * Cards retained for populating or replenishing the table.
   */
  tableDeck: UID[];
  /**
   * The position used to select the next card from the deck.
   */
  deckIndex: number;
  /**
   * Identifier of the storyteller's correct card.
   */
  solutionCardId?: string;
  /**
   * The storyteller's prompt for the current selection.
   */
  story?: string;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `contadores-historias` session.
 */
export interface ContadoresHistoriasState extends DefaultState {
  /**
   * Identifier of the current storyteller.
   */
  storytellerId?: UID;
  /**
   * Identifier of the player who will tell the next story.
   */
  nextStorytellerId?: UID;
  /**
   * The storyteller's prompt for the current selection.
   */
  story?: string;
  /**
   * The table submissions currently available for evaluation.
   */
  table?: any;
  /**
   * The result used to resolve this step or advance the game.
   */
  outcome?: any;
  /**
   * The ranking produced after resolving player scores.
   */
  ranking?: any;
  /**
   * Players or player identifiers selected as winners.
   */
  winners?: any;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `contadores-historias` session.
 */
export interface ContadoresHistoriasInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ContadoresHistoriasStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ContadoresHistoriasState;
}

/**
 * A player-associated table submission and its evaluation or voting data.
 */
export interface TableEntry {
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: UID;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifiers of players who voted for this table card.
   */
  votes: UID[];
  /**
   * Whether this table card is the correct storytelling answer.
   */
  isSolution: boolean;
}

/**
 * The table entries available for the current storytelling vote.
 */
export type Table = TableEntry[];

/**
 * Player action payload accepted by the `contadores-historias` engine.
 */
export interface ContadoresHistoriasSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof CONTADORES_HISTORIAS_ACTIONS;
}

/**
 * Firestore document data used when reading the `contadores-historias` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
/**
 * Firestore document data used when reading the `contadores-historias` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
