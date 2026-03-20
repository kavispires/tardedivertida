// Internal
import type { AchievementKey } from './game';

/**
 * Represents a single game entry in a user's game history
 */
interface GameUserEntry {
  /**
   * Unique identifier for the game
   */
  gameId: string;
  /**
   * Name of the game
   */
  gameName?: string;
  /**
   * Timestamp when the game started
   */
  startedAt: number;
  /**
   * Timestamp when the game ended
   */
  endedAt: number;
  /**
   * Number of players in the game
   */
  playerCount: number;
  /**
   * Player's placement/rank in the game
   */
  placement: number;
  /**
   * User's rating for this game
   */
  rating?: number | null;
  /**
   * Whether the user won this game
   */
  win?: boolean;
  /**
   * Whether the user placed last in this game
   */
  last?: boolean;
  /**
   * List of achievements earned in this game
   */
  achievements: AchievementKey[];
}

/**
 * Statistical data for a specific game tracked per user
 */
export interface GameUserStatistics {
  /**
   * Name of the game
   */
  gameName: string;
  /**
   * Total game plays count
   */
  plays: number;
  /**
   * Boolean if the game is winnable
   */
  isWinnable: boolean;
  /**
   * Total number of wins
   */
  win: number;
  /**
   * Total number of times in last place
   */
  last: number;
  /**
   * Total number of unique achievements
   */
  achievements: Record<AchievementKey, number>;
  /**
   * Total game play duration
   */
  totalPlayDuration: number;
  /**
   * The latest game played
   */
  latestPlay: GameUserEntry;
  /**
   * The game with the shortest duration
   */
  shortestPlay: GameUserEntry;
  /**
   * The game with the longest duration
   */
  longestPlay: GameUserEntry;
  /**
   * The first game played with the earliest startedAt
   */
  firstPlay: GameUserEntry;
  /**
   * The game rating
   */
  rating: number;
  /**
   * Average Player Count
   */
  averagePlayerCount: number;
}

/**
 * Complete user profile with statistics and game history
 */
export interface Me {
  /**
   * Unique identifier for the user
   */
  id: string;
  /**
   * Whether the user has admin privileges
   */
  isAdmin: boolean;
  /**
   * List of user names
   */
  names: string[];
  /**
   * User's preferred language
   */
  language?: Language;
  /**
   * Top 3 avatars
   */
  avatars: string[];
  /**
   * User's gender
   */
  gender?: string;
  /**
   * Overall user statistics across all games
   */
  statistics: {
    /**
     * Total game plays count
     */
    plays: number;
    /**
     * Total different games
     */
    uniqueGamesPlayed: number;
    /**
     * Total games with end goal / are winnable
     */
    winnableGames: number;
    /**
     * Total number of wins
     */
    win: number;
    /**
     * Total number of times in last place
     */
    last: number;
    /**
     * Total number of unique achievements
     */
    achievements: number;
    /**
     * Total game play duration
     */
    totalPlayDuration: number;
    /**
     * The latest game played
     */
    latestPlay: GameUserEntry;
    /**
     * The first game played with the earliest startedAt
     */
    firstPlay: GameUserEntry;
    /**
     * Game with the most entries
     */
    mostPlayedGame: string;
    /**
     * Game with the fewest entries
     */
    leastPlayedGame: string;
    /**
     * Game with the highest rating
     */
    favoriteGame: string;
    /**
     * Game with the lowest rating
     */
    leastFavoriteGame: string;
    /**
     * Game with most wins
     */
    bestAtGame: string;
    /**
     * Game with most last
     */
    worstAtGame: string;
    /**
     * Average Player Count
     */
    averagePlayerCount: number;
  };
  /**
   * Statistics per game
   */
  games: Record<string, GameUserStatistics>;
  /**
   * Record of blurred images for the user
   */
  blurredImages?: Record<UID, true>;
  /**
   * The latest games statistics
   */
  today: {
    /**
     * Number of plays today
     */
    plays: number;
    /**
     * Number of wins today
     */
    win: number;
    /**
     * Number of times in last place today
     */
    last: number;
    /**
     * Number of achievements earned today
     */
    achievements: number;
    /**
     * Total duration of games played today
     */
    duration: number;
    /**
     * List of games played today
     */
    games: GameUserEntry[];
  };
}
