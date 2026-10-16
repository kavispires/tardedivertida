// Types
import type { ArteRuimCardData, TextCardData } from '../../types/tdr';
import type { LINHAS_CRUZADAS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `linhas-cruzadas` session.
 */
export type LinhasCruzadasOptions = {
  /**
   * Whether album prompts are restricted to single-word resources.
   */
  singleWordOnly: boolean;
  /**
   * Whether starting prompts use an even distribution of difficulty levels.
   */
  evenDistribution: boolean;
};

/**
 * A word or drawing-prompt resource used to seed an album.
 */
export type Card = ArteRuimCardData | TextCardData;

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Word resources available for generating prompts.
   */
  allWords: TextCardData[];
  /**
   * Multiword drawing prompts available for album creation.
   */
  allExpressions: ArteRuimCardData[];
};

/**
 * The album slide currently assigned to a player as a writing or drawing prompt.
 */
export type Prompt = {
  /**
   * Identifier of the album entry to which this prompt belongs.
   */
  id: UID; // the album entry id
  /**
   * Identifier of the player who created this album slide.
   */
  author: UID; // the player who created the prompt
  /**
   * The written text or serialized drawing for this slide.
   */
  content: string;
  /**
   * The kind of album content: title, drawing, or cover where supported.
   */
  type: 'title' | 'drawing';
  /**
   * The word count retained for interpreting the assigned prompt.
   */
  wordCount?: number;
};

/**
 * A player-authored title, drawing, or cover in an album.
 */
export type Slide = {
  /**
   * Identifier of the player who created this album slide.
   */
  author: UID;
  /**
   * The written text or serialized drawing for this slide.
   */
  content: string;
  /**
   * The kind of album content: title, drawing, or cover where supported.
   */
  type: 'title' | 'drawing' | 'cover';
};

/**
 * An initial prompt and the sequence of slides created from it.
 */
export type AlbumEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * The text displayed for this card or entry.
   */
  text: string;
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: string;
  /**
   * The ordered title, drawing, and cover slides belonging to this album.
   */
  slides: Slide[];
};

/**
 * Album entries indexed by their originating player identifier.
 */
export interface Album {
  /**
   * Album entries indexed by their originating player identifier.
   */
  [key: string]: AlbumEntry;
}

/**
 * Server-side data retained between phases of a `linhas-cruzadas` session.
 */
export interface LinhasCruzadasStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `linhas-cruzadas` session.
 */
export interface LinhasCruzadasState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}
/**
 * The initial metadata, server-side store, and public state for a `linhas-cruzadas` session.
 */
export interface LinhasCruzadasInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: LinhasCruzadasStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: LinhasCruzadasState;
}

/**
 * Player action payload accepted by the `linhas-cruzadas` engine.
 */
export interface LinhasCruzadasSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof LINHAS_CRUZADAS_ACTIONS;
}

/**
 * Firestore document data used when reading the `linhas-cruzadas` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | LinhasCruzadasState;
/**
 * Firestore document data used when reading the `linhas-cruzadas` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | LinhasCruzadasStore;
