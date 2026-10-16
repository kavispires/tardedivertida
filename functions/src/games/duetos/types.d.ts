// Types
import type { ContenderCardData, ItemData, SuspectCardData, TextCardData } from '../../types/tdr';
import type { DUETOS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `duetos` session.
 */
export type DuetosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw: boolean;
  /**
   * Enables bot selection
   */
  withBots: boolean;
  /**
   * Special grounds
   */
  specialRounds: 'images' | 'sprites' | 'avatars' | 'words' | 'contenders' | 'suspects';
};

/**
 * A selectable pairing item with its resource category and display value.
 */
export type ItemEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * The display value, score value, or movement amount carried by this entry.
   */
  value: any;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The item resources associated with this game step.
   */
  items: ItemData[];
  /**
   * Image-card identifiers available for selection.
   */
  images: UID[];
  /**
   * Emoji sprite indices available for selection.
   */
  emojis: number[];
  /**
   * Glyph sprite indices available for selection.
   */
  glyphs: number[];
  /**
   * Clubber sprite indices available for selection.
   */
  clubbers: number[];
  /**
   * Costume sprite indices available for selection.
   */
  costumes: number[];
  /**
   * Superhero sprite indices available for selection.
   */
  superHeroes: number[];
  /**
   * Word resources or text associated with this entry.
   */
  words: TextCardData[];
  /**
   * Suspect-card resources available for pairing rounds.
   */
  suspects: SuspectCardData[];
  /**
   * Contender resources available for selection or battle.
   */
  contenders: ContenderCardData[];
  /**
   * Resource-deck categories included in this selection.
   */
  decks: string[];
}

/**
 * A selected pair with the round and players who matched it.
 */
type GalleryItem = {
  /**
   * The identifier shared by matching selections of the same pair.
   */
  pairId: string;
  /**
   * The two resources selected as a pair.
   */
  pair: (ItemEntry | undefined)[];
  /**
   * The round associated with this entry.
   */
  round: number;
  /**
   * Identifiers of players who selected the same pair.
   */
  players: UID[];
};

/**
 * The matched pairs and participating players across rounds.
 */
export type Gallery = GalleryItem[];

/**
 * Server-side data retained between phases of a `duetos` session.
 */
export interface DuetosStore extends DefaultStore<DuetosOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `duetos` session.
 */
export interface DuetosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `duetos` session.
 */
export interface DuetosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: DuetosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: DuetosState;
}

/**
 * Player action payload accepted by the `duetos` engine.
 */
export interface DuetosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof DUETOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `duetos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & DuetosState;
/**
 * Firestore document data used when reading the `duetos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & DuetosStore;
