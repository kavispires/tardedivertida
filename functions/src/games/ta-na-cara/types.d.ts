// Types
import type { SuspectCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { TA_NA_CARA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `ta-na-cara` session.
 */
export type TaNaCaraOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
  /**
   * Use everyone instead of just adults
   */
  everyoneDeck?: boolean;
} & SuspectCardsOptions;

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Question resources available for selection.
   */
  questions: TestimonyStatementCardData[];
  /**
   * Character resources available for selection.
   */
  characters: SuspectCardData[];
}

/**
 * The supported negative and positive response strengths for a character statement.
 */
export type AnswerValue = -2 | -1 | 1 | 2;

/**
 * Server-side data retained between phases of a `ta-na-cara` session.
 */
export interface TaNaCaraStore extends DefaultStore<TaNaCaraOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `ta-na-cara` session.
 */
export interface TaNaCaraState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `ta-na-cara` session.
 */
export interface TaNaCaraInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: TaNaCaraStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: TaNaCaraState;
}

/**
 * Player action payload accepted by the `ta-na-cara` engine.
 */
export interface TaNaCaraSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof TA_NA_CARA_ACTIONS;
}

/**
 * Firestore document data used when reading the `ta-na-cara` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | TaNaCaraState;
/**
 * Firestore document data used when reading the `ta-na-cara` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TaNaCaraStore;
