// Types
import type { ItemData, ObjectFeatureCardData } from '../../types/tdr';
import type { MESMICE_ACTIONS, OUTCOME } from './constants';

/**
 * Configuration options used when creating a `mesmice` session.
 */
export type MesmiceOptions = {
  /**
   * Allow NSFW items
   */
  nsfw: boolean;
  /**
   * Uses more complex features
   */
  complexMode: boolean;
  /**
   * Uses 8 features instead of 6
   */
  hardMode: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Object-feature resources selected for this game.
   */
  features: ObjectFeatureCardData[];
  /**
   * The item resources associated with this game step.
   */
  items: Partial<ItemData>[];
};

/**
 * The item identifier and localized name retained for object selection.
 */
export type ObjectCardObj = Pick<ItemData, 'id' | 'name'>;

/**
 * A recorded action or resolved step retained for later evaluation.
 */
export type HistoryEntry = {
  /**
   * Identifier of the feature being evaluated.
   */
  featureId: UID;
  /**
   * Whether the player or entry passes the current evaluation.
   */
  pass: boolean;
  /**
   * Player identifiers recorded for this feature vote.
   */
  votes: UID[];
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * A player's chosen object and clue with its feature-voting history.
 */
export type MesmiceGalleryEntry = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The object chosen by the player.
   */
  item: ObjectCardObj;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
  /**
   * Identifier of the feature being evaluated.
   */
  featureId: UID;
  /**
   * Previously resolved steps associated with this entry.
   */
  history: HistoryEntry[];
};

/**
 * The result used to determine the next game step or final resolution.
 */
export type Outcome = keyof typeof OUTCOME;

/**
 * An object-feature card annotated with its elimination state.
 */
export type ExtendedObjectFeatureCard = ObjectFeatureCardData & {
  /**
   * Whether this object-feature card has been eliminated.
   */
  eliminated?: boolean;
};

/**
 * Server-side data retained between phases of a `mesmice` session.
 */
export interface MesmiceStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `mesmice` session.
 */
export interface MesmiceState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `mesmice` session.
 */
export interface MesmiceInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: MesmiceStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: MesmiceState;
}

/**
 * Player action payload accepted by the `mesmice` engine.
 */
export interface MesmiceSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof MESMICE_ACTIONS;
}

/**
 * Firestore document data used when reading the `mesmice` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | MesmiceState;
/**
 * Firestore document data used when reading the `mesmice` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MesmiceStore;
