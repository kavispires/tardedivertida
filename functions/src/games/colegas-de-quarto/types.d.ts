// Types
import type { TextCardData } from '../../types/tdr';
import type { COLEGAS_DE_QUARTO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `colegas-de-quarto` session.
 */
export type ColegasDeQuartoOptions = {
  /**
   * Determines the source of the grid headers
   */
  wordsSource: 'words' | 'properties';
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
} & ContendersDecksOptions;

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: TextCardData[];
};

/**
 * A board entry containing the clues or card data assigned to that position.
 */
export type BoardEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: string;
  /**
   * The text displayed for this card or entry.
   */
  text: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: string;
};

/**
 * A pair of word identifiers assigned to a player for clue creation.
 */
export type PlayerAssignedPair = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifiers of the words or resources grouped in this entry.
   */
  ids: string[];
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifiers of the words or resources grouped in this entry.
   */
  ids: string[];
  /**
   * Word resources or text associated with this entry.
   */
  words: string[];
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The clue submitted to describe the hidden answer.
   */
  clue: string | null;
  /**
   * Identifiers of players whose guesses were correct.
   */
  correct: UID[];
  /**
   * Incorrect guesses grouped with the players who submitted them.
   */
  misses: {
    /**
     * Identifier of the player making the guess.
     */
    guesserId: UID;
    /**
     * The guesses submitted for the hidden answers.
     */
    guesses: string[];
  }[];
};

/**
 * Round happiness gains and progress toward the cooperative score goal.
 */
export type HouseHappiness = {
  /**
   * Happiness gained from each resolved entry.
   */
  gained: number[];
  /**
   * The target required to complete the game or objective.
   */
  goal: number;
  /**
   * The total happiness accumulated by the household.
   */
  total: number;
};

/**
 * Previously submitted clues grouped by their associated word pair or coordinate.
 */
export type PastClues = Dictionary<string[]>;

/**
 * Server-side data retained between phases of a `colegas-de-quarto` session.
 */
export interface ColegasDeQuartoStore extends DefaultStore<ColegasDeQuartoOptions> {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: TextCardData[];
  /**
   * Previously submitted clues retained for later rounds or persistence.
   */
  pastClues: PastClues;
}

/**
 * Public game state shared with players during a `colegas-de-quarto` session.
 */
export interface ColegasDeQuartoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
}

/**
 * The initial metadata, server-side store, and public state for a `colegas-de-quarto` session.
 */
export interface ColegasDeQuartoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ColegasDeQuartoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ColegasDeQuartoState;
}

/**
 * Player action payload accepted by the `colegas-de-quarto` engine.
 */
export interface ColegasDeQuartoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof COLEGAS_DE_QUARTO_ACTIONS;
}

/**
 * Firestore document data used when reading the `colegas-de-quarto` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & ColegasDeQuartoState;
/**
 * Firestore document data used when reading the `colegas-de-quarto` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ColegasDeQuartoStore;
