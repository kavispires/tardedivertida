// Types
import type { ESPIAO_ENTRE_NOS_ACTIONS } from './constants';

/**
 * Supported commands for controlling the discussion timer.
 */
export type TimerAction = 'START' | 'STOP' | 'RESUME' | 'PAUSE';

/**
 * The result used to determine the next game step or final resolution.
 */
export type Outcome = {
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * The affirmative-vote result retained for this spy accusation.
   */
  votedYes?: string;
  /**
   * Whether the accusation is the final assessment of the round.
   */
  isFinalAssessment: boolean;
};

/**
 * The final spy-game result, including the spy's guess when applicable.
 */
export type Resolution = {
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * Whether the final resolution awards victory to the spy.
   */
  isSpyWin: boolean;
  /**
   * Whether the resolution comes from the spy guessing the location.
   */
  isSpyGuess: boolean;
  /**
   * The answer submitted by the guesser.
   */
  guess?: string;
  /**
   * The secret location revealed in the final spy-game resolution.
   */
  currentLocation?: Location;
};

/**
 * Server-side data retained between phases of a `espiao-entre-nos` session.
 */
export interface EspiaoEntreNosStore extends DefaultStore {
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
 * Public game state shared with players during a `espiao-entre-nos` session.
 */
export interface EspiaoEntreNosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `espiao-entre-nos` session.
 */
export interface EspiaoEntreNosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: EspiaoEntreNosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: EspiaoEntreNosState;
}

/**
 * Player action payload accepted by the `espiao-entre-nos` engine.
 */
export interface EspiaoEntreNosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ESPIAO_ENTRE_NOS_ACTIONS;
}

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Location resources available for setting up the spy round.
   */
  allLocations: Location[];
};

/**
 * Firestore document data used when reading the `espiao-entre-nos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | EspiaoEntreNosState;
/**
 * Firestore document data used when reading the `espiao-entre-nos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EspiaoEntreNosStore;
