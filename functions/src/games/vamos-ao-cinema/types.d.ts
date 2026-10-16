// Types
import type { MovieCardData, MovieReviewCardData } from '../../types/tdr';
import type { VAMOS_AO_CINEMA_ACHIEVEMENTS, VAMOS_AO_CINEMA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `vamos-ao-cinema` session.
 */
export type VamosAoCinemaOptions = {
  /**
   * Whether the game uses a fixed round schedule instead of its score goal.
   */
  fixedRounds: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Movie-card resources indexed by identifier.
   */
  movies: Dictionary<MovieCardData>;
  /**
   * Movie-review resources indexed by identifier.
   */
  reviews: Dictionary<MovieReviewCardData>;
}

/**
 * Card resources recorded as used during the game.
 */
export type UsedCards = (MovieCardData | MovieReviewCardData)[];

/**
 * Movie-card resources available for title creation.
 */
export type MovieDeck = MovieCardData[];
/**
 * Movie-review resources available for clue creation.
 */
export type ReviewsDeck = MovieReviewCardData[];

/**
 * Server-side data retained between phases of a `vamos-ao-cinema` session.
 */
export interface VamosAoCinemaStore extends DefaultStore {
  /**
   * Movie cards available for title creation.
   */
  movieDeck?: MovieDeck;
  /**
   * The position used to select the next movie card.
   */
  movieDeckIndex?: number;
  /**
   * Positive review cards available for clue creation.
   */
  goodReviewsDeck?: MovieDeck;
  /**
   * The position used to select the next positive review.
   */
  goodReviewsDeckIndex?: number;
  /**
   * Negative review cards available for clue creation.
   */
  badReviewsDeck?: MovieDeck;
  /**
   * The position used to select the next negative review.
   */
  badReviewsDeckIndex?: number;
  /**
   * Cards already used and retained for history or resource tracking.
   */
  usedCards?: UsedCards;
  /**
   * Identifiers of the movies already selected.
   */
  selectedMovies?: string[];
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: unknown[];
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck?: unknown[];
  /**
   * The position used to select the next card from the deck.
   */
  deckIndex?: number;
}

/**
 * Achievement identifiers supported by `vamos-ao-cinema`.
 */
export type VamosAoCinemaAchievement = keyof typeof VAMOS_AO_CINEMA_ACHIEVEMENTS;

/**
 * Public game state shared with players during a `vamos-ao-cinema` session.
 */
export interface VamosAoCinemaState extends DefaultState {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
}

/**
 * The initial metadata, server-side store, and public state for a `vamos-ao-cinema` session.
 */
export interface VamosAoCinemaInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: VamosAoCinemaStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: VamosAoCinemaState;
}

/**
 * Player action payload accepted by the `vamos-ao-cinema` engine.
 */
export interface VamosAoCinemaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof VAMOS_AO_CINEMA_ACTIONS;
}

/**
 * Firestore document data used when reading the `vamos-ao-cinema` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | VamosAoCinemaState;
/**
 * Firestore document data used when reading the `vamos-ao-cinema` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | VamosAoCinemaStore;
