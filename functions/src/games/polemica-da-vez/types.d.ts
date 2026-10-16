// Types
import type { TextCardData } from '../../types/tdr';
import type { POLEMICA_DA_VEZ_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `polemica-da-vez` session.
 */
export type PolemicaDaVezOptions = {
  /**
   * Whether the game uses a fixed round schedule instead of its score goal.
   */
  fixedRounds: boolean;
};

/**
 * A text prompt annotated to distinguish player-created content.
 */
export interface CustomTweet extends TextCardData {
  /**
   * Whether this prompt was created by a player.
   */
  custom: boolean;
}

/**
 * The ordered collection of cards available for this game.
 */
export type Deck = TextCardData[];
/**
 * The collection of player-created discussion prompts.
 */
export type CustomDeck = CustomTweet[];

/**
 * Standard and custom prompt decks with their current positions and used prompts.
 */
export interface Decks {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: Deck;
  /**
   * Player-created prompts retained for selection.
   */
  customDeck: CustomDeck;
  /**
   * The position used to select the next card from the deck.
   */
  deckIndex?: number;
  /**
   * The position used to select the next custom prompt.
   */
  customDeckIndex?: number;
  /**
   * Previously played discussion prompts.
   */
  pastTweets?: any[];
}

/**
 * Server-side data retained between phases of a `polemica-da-vez` session.
 */
export interface PolemicaDaVezStore extends DefaultStore {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: UID[];
}

/**
 * Public game state shared with players during a `polemica-da-vez` session.
 */
export interface PolemicaDaVezState extends DefaultState {
  /**
   * Identifier of the player currently expected to act.
   */
  activePlayerId?: UID;
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
  /**
   * Discussion prompts currently displayed for selection.
   */
  currentTweets?: any;
  /**
   * The player-created prompt currently selected.
   */
  currentCustomTweet?: any;
  /**
   * The discussion prompt currently being evaluated.
   */
  currentTweet?: any;
  /**
   * The player-created discussion prompt associated with this round.
   */
  customTweet?: any;
  /**
   * The total likes recorded for the current result.
   */
  totalLikes?: any;
  /**
   * The ranking produced after resolving player scores.
   */
  ranking?: any;
  /**
   * Players or player identifiers selected as winners.
   */
  winners?: any;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `polemica-da-vez` session.
 */
export interface PolemicaDaVezInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: PolemicaDaVezStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: PolemicaDaVezState;
}

/**
 * Player action payload accepted by the `polemica-da-vez` engine.
 */
export interface PolemicaDaVezSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof POLEMICA_DA_VEZ_ACTIONS;
}

/**
 * Firestore document data used when reading the `polemica-da-vez` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
/**
 * Firestore document data used when reading the `polemica-da-vez` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
