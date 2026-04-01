// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { TextCard, SuspectCard, ContenderCard } from 'types/tdr';

/**
 * Payload for submitting pairs
 */
export type SubmitPairsPayload = {
  /**
   * Array of pair IDs selected by the player
   */
  pairs: string[];
};

/**
 * Value of an item which can be various types depending on the round
 */
export type ItemValue =
  | { id: string; name: { en: string; pt: string } } // alien-item
  | TextCard // words
  | SuspectCard // suspects
  | ContenderCard // contenders
  | string // images
  | number // emojis, glyphs, clubbers, costumes, superHeroes
  // biome-ignore lint/suspicious/noExplicitAny: there are too many types and the UI breaks without the any
  | any; // for special rounds with custom types

/**
 * Item that can be paired with another item
 */
export type Item = {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Type of item (alien-item, words, images, etc.)
   */
  type: string;
  /**
   * The actual value/content of the item
   */
  value: ItemValue;
};

/**
 * Gallery entry showing a pair and which players matched them
 */
export type DuetosGalleryEntry = {
  /**
   * Unique identifier for the pair
   */
  pairId: string;
  /**
   * Array of player IDs who made this pairing
   */
  players: UID[];
  /**
   * The two items that form the pair
   */
  pair: Item[];
};

/**
 * Entry for an item that was left out (not paired)
 */
export type LeftOutEntry = {
  /**
   * Unique identifier for the entry
   */
  id: string;
  /**
   * The item that was left out
   */
  item: Item;
  /**
   * Array of player IDs who left this item out
   */
  players: UID[];
};

/**
 * Type of round indicating the source of items
 */
export type RoundType = 'alien-item' | 'mixed' | string;

/**
 * State for the pairing phase where players select pairs of items
 */
export type PhasePairingState = {
  /**
   * The pool of items available for pairing in this round
   */
  pool: Item[];
  /**
   * The type of round (alien-item, mixed, or special deck type)
   */
  roundType: RoundType;
};

/**
 * State for the results phase showing pairing outcomes
 */
export type PhaseResultsState = {
  /**
   * The pool of items that were available for pairing
   */
  pool: Item[];
  /**
   * The type of round (alien-item, mixed, or special deck type)
   */
  roundType: RoundType;
  /**
   * The ranking of players based on pairs made
   */
  ranking: GameRanking;
  /**
   * Gallery of all pairs made and which players made them
   */
  gallery: DuetosGalleryEntry[];
  /**
   * Items that were left out and which players left them out
   */
  leftOut: LeftOutEntry[];
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Complete gallery of all pairs made throughout the game
   */
  gallery: DuetosGalleryEntry[];
};
