// Types
import type { ItemData } from '../../types/tdr';
import type { IDADE_DA_PREDA_ACHIEVEMENTS, IDADE_DA_PREDA_ACTIONS, IDADE_DA_PREDA_PHASES } from './constants';

/**
 * Configuration options used when creating a `idade-da-preda` session.
 */
export type IdadeDaPredaOptions = {
  /**
   * Enable NSFW content
   */
  nsfw?: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Item resources associated with age 0.
   */
  0: ItemData[];
  /**
   * Item resources associated with age 1.
   */
  1: ItemData[];
  /**
   * Item resources associated with age 2.
   */
  2: ItemData[];
  /**
   * Item resources associated with age 3.
   */
  3: ItemData[];
  /**
   * Item resources associated with age 4.
   */
  4: ItemData[];
  /**
   * Item resources associated with age 5.
   */
  5: ItemData[];
};

/**
 * A basic or player-created concept linking a sound to an item meaning.
 */
export type ConceptData = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The key used to identify or group this entry.
   */
  key: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: 'basic' | 'custom';
  /**
   * Identifier of the sound used to pronounce the concept.
   */
  soundId: string;
  /**
   * The localized syllable associated with the concept sound.
   */
  syllable: DualLanguageValue;
  /**
   * The meaning assigned to the concept.
   */
  meaning: string;
  /**
   * Identifiers of items associated with this concept or name.
   */
  itemsIds: string[];
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The age in which the concept was introduced.
   */
  age: number;
};

/**
 * A player-created item name composed from known concepts.
 */
export type NewNameEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The proposed name for the newly discovered concept.
   */
  name: string;
  /**
   * Identifier of the item selected for this entry.
   */
  itemId: string;
  /**
   * Identifiers of the concepts used to compose the item's name.
   */
  conceptsIds: string[];
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = NewNameEntry & {
  /**
   * Identifiers of players whose guesses were correct.
   */
  correctPlayersIds: UID[];
  /**
   * The guesses submitted for the hidden answers.
   */
  guesses: Dictionary<UID[]>;
};

/**
 * Phase identifiers supported by `idade-da-preda`.
 */
export type IdadeDaPredaPhase = keyof typeof IDADE_DA_PREDA_PHASES;

/**
 * Server-side data retained between phases of a `idade-da-preda` session.
 */
export interface IdadeDaPredaStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `idade-da-preda` session.
 */
export interface IdadeDaPredaState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `idade-da-preda` session.
 */
export interface IdadeDaPredaInitialState extends InitialState {
  /**
   * The game-specific state exposed to the session.
   */
  state: IdadeDaPredaState;
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: IdadeDaPredaStore;
}

/**
 * Achievement identifiers supported by `idade-da-preda`.
 */
export type IdadeDaPredaAchievement = keyof typeof IDADE_DA_PREDA_ACHIEVEMENTS;

/**
 * Player action payload accepted by the `idade-da-preda` engine.
 */
export interface IdadeDaPredaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof IDADE_DA_PREDA_ACTIONS;
}

/**
 * Firestore document data used when reading the `idade-da-preda` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | IdadeDaPredaState;
/**
 * Firestore document data used when reading the `idade-da-preda` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | IdadeDaPredaStore;
