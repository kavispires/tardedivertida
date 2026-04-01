// Types
import type { Achievement } from 'types/game';
import type { Item, ObjectFeatureCard } from 'types/tdr';

/**
 * Payload for submitting an object and clue
 */
export type SubmitObjectPayload = {
  /**
   * The ID of the selected item
   */
  itemId: string;
  /**
   * The clue written for the item
   */
  clue: string;
};

/**
 * Payload for submitting a feature elimination vote
 */
export type SubmitFeaturePayload = {
  /**
   * The ID of the feature being voted to eliminate
   */
  featureId: string;
};

/**
 * Simplified object card containing only ID and name
 */
export type ObjectCardObj = Pick<Item, 'id' | 'name'>;

/**
 * Object feature card with optional elimination status
 */
export type ExtendedObjectFeatureCard = ObjectFeatureCard & { eliminated?: boolean };

/**
 * Entry recording one elimination attempt in a round
 */
export type HistoryEntry = {
  /**
   * The ID of the feature that was eliminated
   */
  featureId: UID;
  /**
   * Whether the elimination was successful (correct feature)
   */
  pass: boolean;
  /**
   * IDs of players who voted for this feature
   */
  votes: UID[];
  /**
   * Points awarded for this successful elimination
   */
  score: number;
};

/**
 * Gallery entry showing a player's complete round performance
 */
export type MesmiceGalleryEntry = {
  /**
   * ID of the player who presented
   */
  playerId: UID;
  /**
   * The item that was presented
   */
  item: ObjectCardObj;
  /**
   * The clue given for the item
   */
  clue: string;
  /**
   * The target feature ID the player was trying to reach
   */
  featureId: UID;
  /**
   * Complete history of all elimination attempts for this round
   */
  history: HistoryEntry[];
};

/**
 * Result of calculating the most voted option in a voting scenario
 */
export type MostVotesResult = {
  /**
   * The property that signals the vote (usually `vote`)
   */
  property: string;
  /**
   * The value of the property that signals the vote
   */
  value: string;
  /**
   * The players who voted for this result
   */
  votes: UID[];
  /**
   * How many players voted for this result
   */
  count: number;
  /**
   * In case of a tie in most votes (count)
   */
  tie?: boolean;
};

/**
 * Game outcome types
 */
export type Outcome = 'NEW' | 'CONTINUE' | 'WIN' | 'LOSE';

/**
 * Final group scoring information
 */
export type GroupScore = {
  /**
   * Total possible score the group could achieve
   */
  goal: number;
  /**
   * Actual score achieved by the group
   */
  score: number;
  /**
   * Whether the group won or lost (based on 70% threshold)
   */
  outcome: 'WIN' | 'LOSE';
};

/**
 * State for the clue writing phase where players write clues for their items
 */
export type PhaseClueWritingState = {
  /**
   * The turn order of players
   */
  turnOrder: UID[];
  /**
   * Dictionary of object features with elimination status
   */
  features: Dictionary<ExtendedObjectFeatureCard>;
  /**
   * Current outcome status of the game
   */
  outcome: Outcome;
  /**
   * Current group score
   */
  groupScore: number;
};

/**
 * State for the object feature elimination phase where players vote to eliminate features
 */
export type PhaseObjectFeatureEliminationState = {
  /**
   * The turn order of players
   */
  turnOrder: UID[];
  /**
   * Dictionary of object features with elimination status
   */
  features: Dictionary<ExtendedObjectFeatureCard>;
  /**
   * Current outcome status of the game
   */
  outcome: Outcome;
  /**
   * Current group score
   */
  groupScore: number;
  /**
   * The ID of the currently active player
   */
  activePlayerId: UID;
  /**
   * The item being presented by the active player
   */
  item: ObjectCardObj;
  /**
   * The clue provided by the active player
   */
  clue: string;
  /**
   * The target feature ID the active player is trying to reach
   */
  target: UID;
  /**
   * History of elimination attempts for the current round
   */
  history: HistoryEntry[];
};

/**
 * State for the result phase showing the outcome of the elimination vote
 */
export type PhaseResultState = {
  /**
   * The turn order of players
   */
  turnOrder: UID[];
  /**
   * Dictionary of object features with elimination status
   */
  features: Dictionary<ExtendedObjectFeatureCard>;
  /**
   * Current outcome status of the game
   */
  outcome: Outcome;
  /**
   * Current group score
   */
  groupScore: number;
  /**
   * The ID of the currently active player
   */
  activePlayerId: UID;
  /**
   * The item being presented by the active player
   */
  item: ObjectCardObj;
  /**
   * The clue provided by the active player
   */
  clue: string;
  /**
   * The target feature ID the active player is trying to reach
   */
  target: UID;
  /**
   * History of elimination attempts for the current round
   */
  history: HistoryEntry[];
  /**
   * Ranked voting results showing how players voted
   */
  votes: MostVotesResult[];
};

/**
 * State for the game over phase showing final results and gallery
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Gallery of all items, clues, and their elimination histories
   */
  gallery: MesmiceGalleryEntry[];
  /**
   * Dictionary of object features with elimination status
   */
  features: Dictionary<ExtendedObjectFeatureCard>;
  /**
   * Final group scoring information
   */
  group: GroupScore;
};
