// Types
import type { SENSO_LITERARIO_ACTIONS } from './constants';

/**
 * A book-card pattern defined by color, initial letter, and literary genre.
 */
export type Pattern = {
  /**
   * The display or card-matching color assigned to this entry.
   */
  color: string;
  /**
   * The initial letter represented by the book-card pattern.
   */
  letter: string;
  /**
   * The genre associated with this book pattern or generated movie.
   */
  genre: string;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * The ordered pattern-card identifiers used in the gallery.
   */
  sequence: UID[];
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: {
    /**
     * Identifiers of the players associated with this entry.
     */
    playersIds: UID[];
    /**
     * Identifier of the book pattern selected by these players.
     */
    patternId: UID;
  }[];
};

/**
 * Server-side data retained between phases of a `senso-literario` session.
 */
export interface SensoLiterarioStore extends DefaultStore<unknown> {
  /**
   * Book-card identifiers formatted as color, genre, and initial letter.
   */
  deck: UID[]; // The card id for this game is formatted as `${color}-${genre}-${letter}`
}

/**
 * Public game state shared with players during a `senso-literario` session.
 */
export interface SensoLiterarioState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
}

/**
 * The initial metadata, server-side store, and public state for a `senso-literario` session.
 */
export interface SensoLiterarioInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: SensoLiterarioStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: SensoLiterarioState;
}

/**
 * Player action payload accepted by the `senso-literario` engine.
 */
export interface SensoLiterarioSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof SENSO_LITERARIO_ACTIONS;
}

/**
 * Firestore document data used when reading the `senso-literario` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & SensoLiterarioState;
/**
 * Firestore document data used when reading the `senso-literario` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & SensoLiterarioStore;
