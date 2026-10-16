// Types
import type { SpectrumCardData } from '../../types/tdr';
import type { ONDA_TELEPATICA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `onda-telepatica` session.
 */
export type OndaTelepaticaOptions = {
  /**
   * Whether the game uses a fixed round schedule instead of its score goal.
   */
  fixedRounds: boolean;
};

/**
 * A spectrum category annotated with the psychic's clue and target position.
 */
export interface CategoryCard extends SpectrumCardData {
  /**
   * The hidden target position on the spectrum.
   */
  target?: number;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue?: string;
  /**
   * Identifier of the psychic who supplied the clue.
   */
  psychicId?: string;
}

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Spectrum-category resources indexed by identifier.
   */
  allCategories: {
    /**
     * Spectrum-category resources indexed by their identifier.
     */
    [key: string]: SpectrumCardData;
  };
}

/**
 * Previously played spectrum categories with their clues and targets.
 */
export type PastCategories = CategoryCard[];

/**
 * The ordered collection of cards available for this game.
 */
export type Deck = CategoryCard[];

/**
 * Server-side data retained between phases of a `onda-telepatica` session.
 */
export interface OndaTelepaticaStore extends DefaultStore {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck?: Deck;
  /**
   * The position used to select the next card from the deck.
   */
  deckIndex?: number;
  /**
   * Previously played categories with their clues and targets.
   */
  pastCategories?: PastCategories;

  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `onda-telepatica` session.
 */
export interface OndaTelepaticaState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `onda-telepatica` session.
 */
export interface OndaTelepaticaInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: OndaTelepaticaStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: OndaTelepaticaState;
}

/**
 * Player action payload accepted by the `onda-telepatica` engine.
 */
export interface OndaTelepaticaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ONDA_TELEPATICA_ACTIONS;
}

/**
 * Firestore document data used when reading the `onda-telepatica` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | OndaTelepaticaState;
/**
 * Firestore document data used when reading the `onda-telepatica` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | OndaTelepaticaStore;
