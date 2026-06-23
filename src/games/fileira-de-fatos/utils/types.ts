// Types
import type { Achievement, GameRanking } from 'types/game';
import type { TextCardData } from 'types/tdr';

/**
 * Payload for submitting the order of scenarios
 */
export type SubmitScenarioOrderPayload = {
  /**
   * Ordered array of scenario IDs
   */
  order: UID[];
};

/**
 * Entry representing a position on the scale
 */
export type ScaleEntry = {
  /**
   * Unique identifier for the scale entry
   */
  id: string;
  /**
   * Text label for the scale entry
   */
  text: DualLanguageValue;
};

/**
 * Gallery entry showing a past round's scenarios and active player
 */
export type GalleryEntry = {
  /**
   * The scenarios from a past round
   */
  scenarios: TextCardData[];
  /**
   * The player who was active that round
   */
  playerId: UID;
};

/**
 * Phase state for the ordering phase where players arrange scenarios
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseOrderingState = {
  /**
   * The scenarios to be ordered this round
   */
  scenarios: TextCardData[];
  /**
   * The active player who determines the correct order
   */
  activePlayerId: UID;
  /**
   * The type of round affecting scoring rules
   */
  roundType: string;
  /**
   * The turn order of players for this round
   */
  turnOrder: GameOrder;
};

/**
 * Phase state for the results phase showing scoring outcomes
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseResultsState = {
  /**
   * The scenarios that were ordered this round
   */
  scenarios: TextCardData[];
  /**
   * The active player who determined the correct order
   */
  activePlayerId: UID;
  /**
   * The type of round that affected scoring rules
   */
  roundType: string;
  /**
   * Ranking showing score changes for each player
   */
  ranking: GameRanking;
  /**
   * The turn order of players for this round
   */
  turnOrder: GameOrder;
};

/**
 * Phase state for the game over phase showing final results
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Player IDs of the winning players
   */
  winners: UID[];
  /**
   * Collection of all scenarios and active players from past rounds
   */
  gallery: GalleryEntry[];
  /**
   * Achievements earned by players during the game
   */
  achievements: Achievement[];
};
