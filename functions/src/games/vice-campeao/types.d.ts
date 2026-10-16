// Types
import type { VICE_CAMPEAO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `vice-campeao` session.
 */
export type ViceCampeaoOptions = {
  /**
   * Whether bot players or selections are enabled.
   */
  withBots?: boolean;
};

/**
 * A runner movement or effect card with its targeting rules and resource metadata.
 */
export type RunnerCard = {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * Identifier of the image used to display this entry.
   */
  imageId: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * The movement or effect category used to resolve this runner card.
   */
  type: 'movement-positive' | 'movement-negative' | 'movement-neutral' | 'ongoing' | 'effect' | 'random';
  /**
   * The number of copies of this card included in the deck.
   */
  quantity: number;
  /**
   * The localized description explaining this entry.
   */
  description?: DualLanguageValue;
  /**
   * The display value, score value, or movement amount carried by this entry.
   */
  value?: number;
  /**
   * The effect identifier used to dispatch this card's behavior.
   */
  triggerKey?: string;
  /**
   * Whether the card chooses its target automatically.
   */
  autoTarget?: boolean;
  /**
   * Whether this card effect does not require a target selection.
   */
  omitsTarget?: boolean;
};

/**
 * A resolved runner-card play with its target and before-and-after positions.
 */
export type RunActivity = {
  /**
   * Unique identifier of this game entry.
   */
  id: number; // index
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: UID;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifier of the player targeted by this clue or effect.
   */
  targetId: UID;
  /**
   * The resolved movement or position value for this activity.
   */
  newValue?: number;
  /**
   * Player positions immediately before resolving the card.
   */
  startingPositions: {
    /**
     * Runner positions indexed by player identifier before the activity.
     */
    [key: string]: number;
  };
  /**
   * Player positions after resolving the card.
   */
  endingPositions: {
    /**
     * Runner positions indexed by player identifier after the activity.
     */
    [key: string]: number;
  };
  /**
   * Identifier of the ongoing effect card involved in this activity.
   */
  ongoingEffectCardId?: UID;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: RunnerCard[];
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Identifiers of the items associated with this entry.
   */
  itemsIds: UID[];
  /**
   * The display name or player-submitted name associated with this entry.
   */
  name: string;
  /**
   * Names submitted for the selected items.
   */
  names: string[];
  /**
   * Whether this entry was resolved correctly.
   */
  correct: boolean;
};

/**
 * Server-side data retained between phases of a `vice-campeao` session.
 */
export interface ViceCampeaoStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `vice-campeao` session.
 */
export interface ViceCampeaoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `vice-campeao` session.
 */
export interface ViceCampeaoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ViceCampeaoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ViceCampeaoState;
}

/**
 * Player action payload accepted by the `vice-campeao` engine.
 */
export interface ViceCampeaoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof VICE_CAMPEAO_ACTIONS;
}

/**
 * Firestore document data used when reading the `vice-campeao` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & ViceCampeaoState;
/**
 * Firestore document data used when reading the `vice-campeao` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ViceCampeaoStore;
