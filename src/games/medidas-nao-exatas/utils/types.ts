// Types
import type { Achievement, GameRanking, GameRound } from 'types/game';
import type { TextCard } from 'types/tdr';

/**
 * Payload for submitting the word pool and secret word
 */
export type SubmitPoolPayload = {
  /**
   * IDs of words in the pool
   */
  poolIds: UID[];
  /**
   * ID of the secret word
   */
  secretWordId: UID;
};
/**
 * Payload for submitting metric values
 */
export type SubmitMetricsPayload = {
  /**
   * Metric values for each metric (0-4)
   */
  metrics: Record<string, number>;
};
/**
 * Payload for submitting player guesses
 */
export type SubmitGuessPayload = {
  /**
   * Array of guesses made by the player
   */
  guesses: Guess[];
};
/**
 * A single guess made by a player
 */
export type Guess = {
  /**
   * ID of the card being guessed
   */
  cardId: UID;
  /**
   * Confidence level of the guess (0-4)
   */
  level: number;
  /**
   * Timestamp when the guess was made
   */
  timestamp: number;
  /**
   * ID of the player who made the guess
   */
  playerId?: UID;
  /**
   * Points earned for this guess
   */
  score?: number;
  /**
   * Whether this guess has been used in scoring
   */
  used?: boolean;
  /**
   * Whether this is a retry guess
   */
  retry?: boolean;
};
/**
 * A scoring bracket containing players with the same score
 */
export type GalleryBracket = {
  /**
   * Score value for this bracket
   */
  score: number;
  /**
   * IDs of players in this bracket
   */
  playersIds: UID[];
  /**
   * Wrong guesses made by players
   */
  wrongGuesses: {
    /**
     * ID of the player who made the wrong guess
     */
    playerId: UID;
    /**
     * ID of the card that was incorrectly guessed
     */
    cardId: UID;
    /**
     * Whether the guess was invalid
     */
    invalid?: boolean;
  }[];
};
/**
 * Gallery entry for a completed round
 */
export type GalleryEntry = {
  /**
   * ID of the secret word for this round
   */
  secretWordId: UID;
  /**
   * Dictionary of cards used in this round
   */
  cards: Record<UID, TextCard>;
  /**
   * Descriptors for each metric
   */
  metricsDescriptors: Record<string, TextCard[]>;
  /**
   * Metric values for each metric
   */
  metrics: Record<UID, number>;
  /**
   * Scoring brackets for this round
   */
  brackets: GalleryBracket[];
};
/**
 * State for the Metrics Building phase
 */
export type PhaseMetricsBuildingState = {
  /**
   * ID of the player who is presenting this round
   */
  presenterId: UID;
  /**
   * Order of players for the game
   */
  turnOrder: GameOrder;
  /**
   * Dictionary of all words available in this round
   */
  wordsDict: Dictionary<TextCard>;
  /**
   * Initial two word options for the secret word
   */
  secretCardsOptionsIds: UID[];
  /**
   * Words available to add to the pool
   */
  availablePoolCardsIds: UID[];
  /**
   * Pool of words selected by the presenter
   */
  poolIds?: UID[];
  /**
   * The secret word chosen by the presenter
   */
  secretWordId?: UID;
  /**
   * Descriptors for each metric (0-4)
   */
  metricsDescriptors: Record<string, TextCard[]>;
  /**
   * Points awarded for each ranking bracket
   */
  pointsBrackets: number[];
};
/**
 * State for the Guessing phase
 */
export type PhaseGuessingState = {
  /**
   * ID of the player who is presenting this round
   */
  presenterId: UID;
  /**
   * Order of players for the game
   */
  turnOrder: GameOrder;
  /**
   * The secret word chosen by the presenter
   */
  secretWordId: UID;
  /**
   * Dictionary of words in the pool
   */
  wordsDict: Dictionary<TextCard>;
  /**
   * Pool of words visible to players
   */
  poolIds: UID[];
  /**
   * Descriptors for each metric (0-4)
   */
  metricsDescriptors: Record<string, TextCard[]>;
  /**
   * Metric values assigned by the presenter (0-4)
   */
  metrics: Record<string, number>;
  /**
   * Points awarded for each ranking bracket
   */
  pointsBrackets: number[];
};
/**
 * State for the Results phase
 */
export type PhaseResultsState = {
  /**
   * ID of the player who presented this round
   */
  presenterId: UID;
  /**
   * Order of players for the game
   */
  turnOrder: GameOrder;
  /**
   * Results of the round including guesses and scoring
   */
  result: GalleryEntry;
  /**
   * Player rankings for this round
   */
  ranking: GameRanking;
};
/**
 * State for the Game Over phase
 */
export type PhaseGameOverState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of player IDs who won
   */
  winners: UID[];
  /**
   * Player achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Collection of all round results
   */
  gallery: GalleryEntry[];
};
