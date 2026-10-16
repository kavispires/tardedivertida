// Types
import type { TextCardData } from '../../types/tdr';
import type { VENDAVAL_DE_PALPITE_ACTIONS } from './constants';

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Word resources or text associated with this entry.
   */
  words: TextCardData[];
  /**
   * Category resources available for secret-word selection.
   */
  categories: TextCardData[];
};

/**
 * A clue identifier composed from its player, round, position, and optional guess.
 */
export type ClueId = string;

/**
 * A submitted player clue and its evaluation against the secret word.
 */
export type Clue = {
  /**
   * Unique identifier of this game entry.
   */
  id: ClueId;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
  /**
   * Indicates if the boss has already evaluated this clue against the secret word
   */
  evaluation?: boolean;
  /**
   * Indicates if clue is a final guess
   */
  isGuess?: boolean;
  /**
   * Indicates if the boss has used help to reveal the resolution of this clue
   */
  isResolved?: boolean;
};

/**
 * Submitted clues indexed by their composite identifier.
 */
export type Clues = Record<ClueId, Clue>;

/**
 * The round number used to group board clues and boss evaluations.
 */
export type CurrentRound = number;

/**
 * A board entry containing the clues or card data assigned to that position.
 */
export type BoardEntry = {
  /**
   * The submitted clues or clue identifiers associated with this round.
   */
  clues: ClueId[];
  /**
   * The boss's evaluation associated with these clues.
   */
  evaluation?: number;
};

/**
 * Round entries indexed by round number.
 */
export type Board = Record<CurrentRound, BoardEntry>;

/**
 * Server-side data retained between phases of a `vendaval-de-palpite` session.
 */
export interface VendavalDePalpiteStore extends DefaultStore {
  /**
   * Category resources available for secret-word selection.
   */
  categories: TextCardData[];
  /**
   * Word resources or text associated with this entry.
   */
  words: TextCardData[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `vendaval-de-palpite` session.
 */
export interface VendavalDePalpiteState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `vendaval-de-palpite` session.
 */
export interface VendavalDePalpiteInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: VendavalDePalpiteStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: VendavalDePalpiteState;
}

/**
 * Player action payload accepted by the `vendaval-de-palpite` engine.
 */
export interface VendavalDePalpiteSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof VENDAVAL_DE_PALPITE_ACTIONS;
}

/**
 * Firestore document data used when reading the `vendaval-de-palpite` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | VendavalDePalpiteState;
/**
 * Firestore document data used when reading the `vendaval-de-palpite` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | VendavalDePalpiteStore;
