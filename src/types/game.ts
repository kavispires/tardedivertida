import type { ReactNode } from 'react';
/**
 * React type for component children
 */

/**
 * Unique identifier for an achievement type
 */
export type AchievementKey = string;

/**
 * Represents an achievement earned by a player
 */
export type Achievement = {
  /**
   * Type of achievement
   */
  type: string;
  /**
   * Player who earned the achievement
   */
  playerId: UID;
  /**
   * Value associated with the achievement
   */
  value: Primitive;
};

/**
 * Display information for an achievement
 */
export type AchievementInfo = {
  /**
   * Icon identifier for the achievement
   */
  icon: string;
  /**
   * Achievement title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Optional achievement description in multiple languages
   */
  description?: DualLanguageValue;
};

/**
 * Collection of achievement information indexed by achievement key
 */
export type AchievementReference = Record<string, AchievementInfo>;

/**
 * Represents a player in a game session
 */
export type GamePlayer<TPlayer = PlainObject> = {
  /**
   * Unique identifier for the player
   */
  id: UID;
  /**
   * Player's display name
   */
  name: string;
  /**
   * Avatar identifier for the player
   */
  avatarId: string;
  /**
   * Timestamp of last update
   */
  updatedAt: DateMilliseconds;
  /**
   * Whether the player is ready to proceed
   */
  ready: boolean;
  /**
   * Additional dynamic properties
   */
  // biome-ignore lint/suspicious/noExplicitAny: allows flexible player data
  [key: string]: any;
} & TPlayer;

/**
 * Collection of players indexed by their UID
 */
export type GamePlayers<TPlayer = PlainObject> = Record<UID, GamePlayer<TPlayer>>;

/**
 * Represents the complete state of a game session
 */
export type GameState<TState = PlainObject, TPlayer = PlainObject> = {
  /**
   * Current phase of the game
   */
  phase: string;
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * All players in the game session
   */
  players: GamePlayers<TPlayer>;
  /**
   * Timestamp of last state update
   */
  updatedAt?: DateMilliseconds;
  /**
   * Optional redirect information
   */
  redirect?: Redirect;
} & TState;

/**
 * Props required for game session components
 */
export type SessionProps = {
  /**
   * Unique identifier for the game session
   */
  gameId: string;
};

/**
 * Metadata information about a game instance
 */
export type GameMeta = {
  /**
   * Timestamp when the game was created
   */
  createdAt: DateMilliseconds;
  /**
   * User ID of the game creator
   */
  createdBy: string;
  /**
   * Unique identifier for the game
   */
  gameId: string;
  /**
   * Name of the game
   */
  gameName: string;
  /**
   * Whether the game has finished
   */
  isComplete: boolean;
  /**
   * Whether the game is locked from new players
   */
  isLocked: boolean;
  /**
   * Language being used in the game
   */
  language: Language;
  /**
   * Maximum number of players allowed
   */
  max: number;
  /**
   * Minimum number of players required
   */
  min: number;
  /**
   * Optional game configuration settings
   */
  options?: Dictionary<boolean>;
  /**
   * Number of times the game has been replayed
   */
  replay: number;
  /**
   * Game version
   */
  version: string;
};

/**
 * Information about the current game round
 */
export type GameRound = {
  /**
   * Current round number
   */
  current: number;
  /**
   * Total number of rounds in the game
   */
  total: number;
  /**
   * Whether to force this as the last round
   */
  forceLastRound: boolean;
};

/**
 * Props passed to game phase components
 */
export type PhaseProps<TState = PlainObject, TPlayer = PlainObject> = {
  /**
   * Current game state
   */
  state: GameState<TState, TPlayer>;
  /**
   * All players in the game
   */
  players: GamePlayers<TPlayer>;
  /**
   * Game metadata
   */
  meta: GameMeta;
  /**
   * Current user's player data
   */
  user: GamePlayer<TPlayer>;
};

/**
 * Props for phase provider components that wrap game phases
 */
export type PhaseProviderProps<TState = PlainObject, TPlayer = PlainObject> = PhaseProps<TState, TPlayer> & {
  /**
   * Child components to render
   */
  children: ReactNode;
};

/**
 * Array representing the ranking of players with their score progression
 */
export type GameRanking = {
  /**
   * Unique identifier for the player
   */
  playerId: string;
  /**
   * Score before this round
   */
  previousScore: number;
  /**
   * Points gained in this round
   */
  gainedPoints: number | number[];
  /**
   * Score after this round
   */
  newScore: number;
  /**
   * Additional dynamic properties
   */
  // biome-ignore lint/suspicious/noExplicitAny:on purpose
  [key: string]: any;
}[];
