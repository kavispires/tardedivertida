// Types
import type { Achievement, GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

/**
 * Represents a tweet that has been shown previously in the game
 */
export type PastTweet = {
  /**
   * Unique identifier for the tweet
   */
  id: string;
  /**
   * The tweet content
   */
  text: string;
  /**
   * Number of likes this tweet received from players
   */
  likes: number;
  /**
   * Whether this tweet was custom-created by a player
   */
  custom?: boolean;
};

/**
 * Payload for submitting a tweet selection
 */
export type SubmitTweetPayload = {
  /**
   * ID of the selected tweet
   */
  tweetId: string;
  /**
   * Custom tweet text if player created their own
   */
  customTweet?: string;
};

/**
 * Payload for submitting a reaction to a tweet
 */
export type SubmitReactionPayload = {
  /**
   * Whether the player likes the tweet
   */
  reaction: boolean;
  /**
   * Player's guess for total number of likes
   */
  likesGuess: number;
};

/**
 * State for the Tweet Selection phase
 * Players select a tweet for others to react to
 */
export type PhaseTweetSelectionState = {
  /**
   * Order of players for the game
   */
  gameOrder: UID[];
  /**
   * ID of the player currently selecting a tweet
   */
  activePlayerId: UID;
  /**
   * Available tweet options for selection
   */
  currentTweets: TextCard[];
  /**
   * Custom tweet option available for selection
   */
  currentCustomTweet: TextCard;
};

/**
 * State for the React phase
 * Players react to the selected tweet and guess total likes
 */
export type PhaseReactState = {
  /**
   * Order of players for the game
   */
  gameOrder: UID[];
  /**
   * ID of the player who selected the tweet
   */
  activePlayerId: UID;
  /**
   * The tweet currently being shown
   */
  currentTweet: TextCard;
  /**
   * Custom tweet text if the active player created their own, null otherwise
   */
  customTweet: string | null;
};

/**
 * State for the Resolution phase
 * Shows results of reactions and awards points
 */
export type PhaseResolutionState = {
  /**
   * Order of players for the game
   */
  gameOrder: UID[];
  /**
   * ID of the player who selected the tweet
   */
  activePlayerId: UID;
  /**
   * The tweet that was shown
   */
  currentTweet: TextCard;
  /**
   * Custom tweet text if it was used, null otherwise
   */
  customTweet: string | null;
  /**
   * Total number of likes the tweet received
   */
  totalLikes: number;
  /**
   * Player rankings with scores for this round
   */
  ranking: GameRanking;
};

/**
 * State for the Game Over phase
 * Shows final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * IDs of the winning players
   */
  winners: UID[];
  /**
   * All tweets that were shown during the game
   */
  allTweets: PastTweet[];
  /**
   * Achievements earned by players
   */
  achievements: Achievement[];
};
