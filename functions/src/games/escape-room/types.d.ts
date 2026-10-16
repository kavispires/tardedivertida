// Types
import type { ESCAPE_ROOM_ACHIEVEMENTS, ESCAPE_ROOM_ACTIONS, OUTCOME } from './constants';

/**
 * Configuration options used when creating a `escape-room` session.
 */
export type EscapeRoomOptions = {
  /**
   * Selects the default, shorter, or longer game duration
   */
  duration: 'default' | 'short' | 'long';
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
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
};

/**
 * The result used to determine the next game step or final resolution.
 */
export type Outcome = keyof typeof OUTCOME;

/**
 * Achievement identifiers supported by `escape-room`.
 */
export type EscapeRoomAchievement = keyof typeof ESCAPE_ROOM_ACHIEVEMENTS;

/**
 * Server-side data retained between phases of a `escape-room` session.
 */
export interface EscapeRoomStore extends DefaultStore<EscapeRoomOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
}

/**
 * Public game state shared with players during a `escape-room` session.
 */
export interface EscapeRoomState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
}

/**
 * The initial metadata, server-side store, and public state for a `escape-room` session.
 */
export interface EscapeRoomInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: EscapeRoomStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: EscapeRoomState;
}

/**
 * Player action payload accepted by the `escape-room` engine.
 */
export interface EscapeRoomSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ESCAPE_ROOM_ACTIONS;
}

/**
 * Firestore document data used when reading the `escape-room` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & EscapeRoomState;
/**
 * Firestore document data used when reading the `escape-room` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & EscapeRoomStore;
