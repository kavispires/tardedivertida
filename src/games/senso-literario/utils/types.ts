// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';

/**
 * Payload for submitting a pattern selection
 */
export type SubmitPatternPayload = {
  /**
   * ID of the selected pattern
   */
  patternId: string;
};

/**
 * Gallery entry for a completed round showing pattern selections
 */
export type GalleryEntry = {
  /**
   * The sequence of card IDs shown this round
   */
  sequence: UID[];
  /**
   * Cards with player selections
   */
  cards: {
    /**
     * Array of player IDs who selected this pattern
     */
    playersIds: UID[];
    /**
     * ID of the pattern card
     */
    patternId: UID;
  }[];
};

/**
 * State for the pattern creation phase where players select patterns matching the sequence
 */
export type PhasePatternCreationState = {
  /**
   * The sequence of card IDs to memorize and match
   */
  sequence: string[];
};

/**
 * State for the result phase showing pattern selection results
 */
export type PhaseResultState = {
  /**
   * The sequence of card IDs shown this round
   */
  sequence: string[];
  /**
   * Gallery entry showing all player selections
   */
  gallery: GalleryEntry;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Gallery entries from all rounds
   */
  gallery: GalleryEntry[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
};
