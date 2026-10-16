// Types
import type { ContenderCardData } from '../../types/tdr';
import type { QUEM_SOU_EU_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `quem-sou-eu` session.
 */
export type QuemSouEuOptions = {
  /**
   * Adds two more characters to the table
   */
  moreCharacters?: boolean;
  /**
   * Possibly include nsfw characters
   */
  nsfw?: boolean;
  /**
   * Uses image cards instead of characters
   */
  imageCardsMode?: boolean;
} & ContendersDecksOptions;

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Character resources available for selection.
   */
  characters: ContenderCardData[];
  /**
   * Image-card resources available as alternate character prompts.
   */
  imageCards: ContenderCardData[];
}

/**
 * A player-associated character and its localized display information.
 */
export interface Character {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * The localized description explaining this entry.
   */
  description: DualLanguageValue;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
}

/**
 * Server-side data retained between phases of a `quem-sou-eu` session.
 */
export interface QuemSouEuStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `quem-sou-eu` session.
 */
export interface QuemSouEuState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `quem-sou-eu` session.
 */
export interface QuemSouEuInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: QuemSouEuStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: QuemSouEuState;
}

/**
 * Player action payload accepted by the `quem-sou-eu` engine.
 */
export interface QuemSouEuSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof QUEM_SOU_EU_ACTIONS;
}

/**
 * Firestore document data used when reading the `quem-sou-eu` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemSouEuState;
/**
 * Firestore document data used when reading the `quem-sou-eu` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemSouEuStore;
