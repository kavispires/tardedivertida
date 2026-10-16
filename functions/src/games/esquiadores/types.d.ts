// Types
import type { DilemmaCardData } from '../../types/tdr';
import type { ESQUIADORES_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `esquiadores` session.
 */
export type EsquiadoresOptions = {
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
   * Dilemma resources available for mountain decision points.
   */
  dilemmas: DilemmaCardData[];
};

/**
 * A mountain decision point with its dilemma, selected direction, and assigned players.
 */
export type MountainDilemma = {
  /**
   * Unique identifier of this game entry.
   */
  id: number;
  /**
   * Identifier of the sprite used to display this entry.
   */
  spriteId: string;
  /**
   * The dilemma presented at this mountain decision point.
   */
  dilemma: DilemmaCardData;
  /**
   * Whether this route option has been selected.
   */
  selected: boolean;
  /**
   * The selected route direction, or null before a choice.
   */
  direction: 'left' | 'right' | null;
  /**
   * Identifiers of players assigned to this mountain dilemma.
   */
  players?: string[];
};

/**
 * An end-of-route lodge and the players assigned to it.
 */
export type Lodge = {
  /**
   * Unique identifier of this game entry.
   */
  id: number;
  /**
   * Whether this route option has been selected.
   */
  selected: boolean;
  /**
   * Identifiers of the players associated with this entry.
   */
  playersIds: UID[];
};

/**
 * Server-side data retained between phases of a `esquiadores` session.
 */
export interface EsquiadoresStore extends DefaultStore {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: DilemmaCardData[];
}

/**
 * Public game state shared with players during a `esquiadores` session.
 */
export interface EsquiadoresState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `esquiadores` session.
 */
export interface EsquiadoresInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: EsquiadoresStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: EsquiadoresState;
}

/**
 * Player action payload accepted by the `esquiadores` engine.
 */
export interface EsquiadoresSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ESQUIADORES_ACTIONS;
}

/**
 * Firestore document data used when reading the `esquiadores` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | EsquiadoresState;
/**
 * Firestore document data used when reading the `esquiadores` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EsquiadoresStore;
