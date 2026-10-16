// Types
import type { MonsterImageData } from '../../types/tdr';
import type { RETRATO_FALADO_ACTIONS } from './constants';

/**
 * A monster resource annotated with its player-created sketch.
 */
export interface MonsterSketch extends MonsterImageData {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID | null;
  /**
   * The serialized monster sketch, or null before submission.
   */
  sketch: string | null;
}

/**
 * Monster resources indexed by their identifier.
 */
export interface AllMonsters {
  /**
   * Monster resources indexed by their identifier.
   */
  [key: string]: MonsterImageData;
}

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Monster resources available for drawing rounds.
   */
  allMonsters: AllMonsters;
}

/**
 * Server-side data retained between phases of a `retrato-falado` session.
 */
export interface RetratoFaladoStore extends DefaultStore {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: MonsterImageData[];
  /**
   * Monster sketches retained from completed rounds.
   */
  pastSketches: MonsterSketch[];
}

/**
 * Public game state shared with players during a `retrato-falado` session.
 */
export interface RetratoFaladoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}
/**
 * The initial metadata, server-side store, and public state for a `retrato-falado` session.
 */
export interface RetratoFaladoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: RetratoFaladoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: RetratoFaladoState;
}

/**
 * Player action payload accepted by the `retrato-falado` engine.
 */
export interface RetratoFaladoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof RETRATO_FALADO_ACTIONS;
}

/**
 * Firestore document data used when reading the `retrato-falado` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | RetratoFaladoStore;
/**
 * Firestore document data used when reading the `retrato-falado` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | RetratoFaladoState;
