// Types
import type { Achievement, GameRanking } from 'types/game';
import type { TextCard, SuspectCard, ContenderCard } from 'types/tdr';

export type SubmitPairsPayload = {
  pairs: string[];
};

export type ItemValue =
  | { id: string; name: { en: string; pt: string } } // alien-item
  | TextCard // words
  | SuspectCard // suspects
  | ContenderCard // contenders
  | string // images
  | number // emojis, glyphs, clubbers, costumes, superHeroes
  // biome-ignore lint/suspicious/noExplicitAny: there are too many types and the UI breaks without the any
  | any; // for special rounds with custom types

export type Item = {
  id: string;
  type: string;
  value: ItemValue;
};

export type DuetosGalleryEntry = {
  pairId: string;
  players: UID[];
  pair: Item[];
};

export type LeftOutEntry = {
  id: string;
  item: Item;
  players: UID[];
};

export type RoundType = 'alien-item' | 'mixed' | string;

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

export type PhaseResultsState = PhasePairingState & {
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

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * List of player IDs who won the game
   */
  winners: string[];
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Complete gallery of all pairs made throughout the game
   */
  gallery: DuetosGalleryEntry[];
};
