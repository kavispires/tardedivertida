/**
 * Server-side data retained between phases of a `instrumentos-codificados` session.
 */
export interface InstrumentosCodificadosStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `instrumentos-codificados` session.
 */
export interface InstrumentosCodificadosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `instrumentos-codificados` session.
 */
export interface InstrumentosCodificadosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: InstrumentosCodificadosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: InstrumentosCodificadosState;
}

/**
 * A clue targeting a particular position in another player's secret code.
 */
export interface Hint {
  /**
   * The clue given for the target code position.
   */
  hint: string;
  /**
   * Identifier of the player targeted by this clue or effect.
   */
  targetId: UID;
  /**
   * The code position referenced by this hint.
   */
  position: number;
}

/**
 * Player action payload accepted by the `instrumentos-codificados` engine.
 */
export interface InstrumentosCodificadosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: 'SUBMIT_HINT' | 'SUBMIT_CONCLUSIONS' | 'SUBMIT_CODE';
}

/**
 * Firestore document data used when reading the `instrumentos-codificados` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | InstrumentosCodificadosState;
/**
 * Firestore document data used when reading the `instrumentos-codificados` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | InstrumentosCodificadosStore;
