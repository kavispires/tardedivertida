// Types
import type { TextCardData } from '../../types/tdr';
import type { GALERIA_DE_SONHOS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `galeria-de-sonhos` session.
 */
export type GaleriaDeSonhosOptions = {
  /**
   * Add bots to the game
   */
  withBots?: boolean;
  /**
   * UI will required minimum of 4-7 cards selected
   */
  surpriseMode: boolean;
};

/**
 * Word resources indexed by card identifier.
 */
export type AllWords = {
  /**
   * Word resources indexed by their identifier.
   */
  [key: string]: TextCardData;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Word resources available for generating prompts.
   */
  allWords: AllWords;
  /**
   * Image-card identifiers available for selection.
   */
  images: UID[];
};

/**
 * A table image card and its usage and matching state.
 */
export type ImageCard = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Whether this entry has already been used or resolved.
   */
  used: boolean;
  /**
   * Identifiers of players whose selections matched this entry.
   */
  matchedPlayers?: UID[];
  /**
   * The text displayed for this card or entry.
   */
  text?: string;
};

/**
 * A player-selected image card with its matches and awarded score.
 */
export type PlayerCard = {
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: string;
  /**
   * Whether this entry has already been used or resolved.
   */
  used: boolean;
  /**
   * Identifiers of players whose selections matched this entry.
   */
  matchedPlayers: UID[];
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * An image card annotated with its label and matching players.
 */
export type ImageCardMatch = {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * Whether this entry has already been used or resolved.
   */
  used: boolean;
  /**
   * The text displayed for this card or entry.
   */
  text: string;
  /**
   * Identifiers of players whose selections matched this entry.
   */
  matchedPlayers: UID[];
};

/**
 * Server-side data retained between phases of a `galeria-de-sonhos` session.
 */
export interface GaleriaDeSonhosStore extends DefaultStore {
  /**
   * Cards retained for populating or replenishing the table.
   */
  tableDeck: ImageCard[];
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: TextCardData[];
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: GameOrder;
  /**
   * Whether bot players or selections are enabled.
   */
  withBots?: boolean;
}

/**
 * Public game state shared with players during a `galeria-de-sonhos` session.
 */
export interface GaleriaDeSonhosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `galeria-de-sonhos` session.
 */
export interface GaleriaDeSonhosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: GaleriaDeSonhosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: GaleriaDeSonhosState;
}

/**
 * Player action payload accepted by the `galeria-de-sonhos` engine.
 */
export interface GaleriaDeSonhosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof GALERIA_DE_SONHOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `galeria-de-sonhos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | GaleriaDeSonhosState;
/**
 * Firestore document data used when reading the `galeria-de-sonhos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | GaleriaDeSonhosStore;
