// Types
import type { TextCardData } from '../../types/tdr';
import type { MEDIDAS_NAO_EXATAS_ACTIONS } from './constants';

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Word resources available for generating prompts.
   */
  allWords: TextCardData[];
  /**
   * Descriptor-card resources available for prompt creation.
   */
  allDescriptors: TextCardData[];
};

/**
 * A submitted guess for the game's hidden answer or target.
 */
export type Guess = {
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: UID;
  /**
   * The guess level used when scoring this attempt.
   */
  level: number;
  /**
   * Submission time used to order or compare player answers.
   */
  timestamp: number;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId?: UID;
  /**
   * Whether this entry has already been used or resolved.
   */
  used?: boolean;
  /**
   * Whether this guess is a retry after a previous attempt.
   */
  retry?: boolean;
};

/**
 * A scored group of matching guesses and the incorrect guesses associated with it.
 */
export type GalleryBracket = {
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
  /**
   * Identifiers of the players associated with this entry.
   */
  playersIds: UID[];
  /**
   * Incorrect guesses grouped with their submitting players.
   */
  wrongGuesses: {
    /**
     * Identifier of the player associated with this entry.
     */
    playerId: UID;
    /**
     * Identifier of the card associated with this entry.
     */
    cardId: UID;
    /**
     * Whether this clue or guess is invalid for scoring.
     */
    invalid?: boolean;
  }[];
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Identifier of the hidden word being guessed.
   */
  secretWordId: UID;
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: Record<UID, TextCardData>;
  /**
   * Descriptor cards associated with each metric.
   */
  metricsDescriptors: Record<string, TextCardData[]>;
  /**
   * The metric values assigned to the hidden word.
   */
  metrics: Record<UID, number>;
  /**
   * The scored groups used to present the guesses.
   */
  brackets: GalleryBracket[];
};

/**
 * Server-side data retained between phases of a `medidas-nao-exatas` session.
 */
export interface MedidasNaoExatasStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `medidas-nao-exatas` session.
 */
export interface MedidasNaoExatasState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `medidas-nao-exatas` session.
 */
export interface MedidasNaoExatasInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: MedidasNaoExatasStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: MedidasNaoExatasState;
}

/**
 * Player action payload accepted by the `medidas-nao-exatas` engine.
 */
export interface MedidasNaoExatasSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof MEDIDAS_NAO_EXATAS_ACTIONS;
}

/**
 * Firestore document data used when reading the `medidas-nao-exatas` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & MedidasNaoExatasState;
/**
 * Firestore document data used when reading the `medidas-nao-exatas` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & MedidasNaoExatasStore;
