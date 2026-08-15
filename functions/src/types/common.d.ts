/** biome-ignore-all lint/correctness/noUnusedVariables: is globally available with .d.ts */

/**
 * Unique identifier string used throughout the application for entities like games, players, and resources
 */
type UID = string;

/**
 * Timestamp in milliseconds since Unix epoch
 */
type DateMilliseconds = number;

/**
 * Supported languages in the application
 */
type Language = 'en' | 'pt';

/**
 * Basic primitive types in JavaScript
 */
type Primitive = string | number | boolean | symbol | null;

/**
 * Array of UIDs representing the order of games
 */
type GameOrder = UID[];

/**
 * Array of UIDs representing the turn order of players
 */
type TurnOrder = UID[];

/**
 * Object containing translations in both supported languages
 */
type DualLanguageValue<T = string> = {
  /**
   * English translation
   */
  en: T;
  /**
   * Portuguese translation
   */
  pt: T;
};

/**
 * Represents a value that can be of any type or unknown, used for flexibility in type definitions
 */
// biome-ignore lint/suspicious/noExplicitAny: on purpose
type AnyOrUnknownPlaceholder = any | unknown;

// COMMON INTERFACES

/**
 * Generic object with string keys and any values
 */
interface PlainObject {
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Firebase function context object
 */
type FirebaseContext = {
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Generic dictionary type mapping UIDs to values of type T
 */
type Dictionary<T> = Record<UID, T>;

/**
 * Used to wrap HttpsCallable functions groups
 */
type CallablePayload<TPayload> = TPayload & { action: string };

/**
 * Configuration options for game instances
 */
interface GameOptions {
  [key: string]: boolean | string | string[] | number;
}

/**
 * Payload structure for player actions in a game
 */
interface ActionPayload {
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the player performing the action
   */
  playerId: UID;
  /**
   * The type of action being performed
   */
  action: string;
  /**
   * Additional action-specific properties
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Game engine interface defining core game mechanics
 */
interface Engine {
  /**
   * Function to generate the initial state of the game
   */
  getInitialState: any;
  /**
   * Function to determine the next phase of the game
   */
  getNextPhase: any;
  /**
   * Function to get the minimum and maximum player counts
   */
  getPlayerCounts: () => PlayerCounts;
  /**
   * Function to process player actions
   */
  submitAction: any;
}

/**
 * Payload for adding a player to a game
 */
interface AddPlayerPayload {
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The display name of the player
   */
  playerName: string;
  /**
   * The avatar identifier for the player
   */
  playerAvatarId: string;
  /**
   * Whether the player is joining as a guest
   */
  isGuest?: boolean;
}

/**
 * Metadata for a game instance
 */
interface Meta<TOptions = GameOptions> {
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * Timestamp when the game was created
   */
  createdAt: DateMilliseconds;
  /**
   * The UID of the user who created the game
   */
  createdBy: string;
  /**
   * Minimum number of players required
   */
  min: number;
  /**
   * Maximum number of players allowed
   */
  max: number;
  /**
   * Whether the game is locked from new players joining
   */
  isLocked: boolean;
  /**
   * Whether the game has been completed
   */
  isComplete: boolean;
  /**
   * The language of the game
   */
  language: string;
  /**
   * The version of the game engine
   */
  version?: string;
  /**
   * The replay counter for games being replayed
   */
  replay: number;
  /**
   * Game-specific configuration options
   */
  options?: TOptions;
}

/**
 * Minimum and maximum player counts for a game
 */
interface PlayerCounts {
  /**
   * Minimum number of players required to play
   */
  MIN: number;
  /**
   * Maximum number of players allowed
   */
  MAX: number;
}

/**
 * Information for redirecting to another game
 */
interface Redirect {
  /**
   * Timestamp when the redirect should occur
   */
  redirectAt: DateMilliseconds;
  /**
   * The unique identifier of the target game
   */
  gameId: UID;
  /**
   * The name of the target game
   */
  gameName: string;
}

/**
 * The default game state structure shared across all games
 */
interface DefaultState {
  /**
   * The current phase of the game
   */
  phase: string;
  /**
   * The current round information
   */
  round: Round;
  /**
   * Timestamp of the last state update
   */
  updatedAt: DateMilliseconds;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt?: DateMilliseconds;
  /**
   * Dictionary of all players in the game
   */
  players: Players;
  /**
   * Optional redirect information for game transitions
   */
  redirect?: Redirect;
  /**
   * Additional game-specific state properties
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The default store structure for persistent game data
 */
interface DefaultStore<TOptions = GameOptions> {
  /**
   * Timestamp when the game was created
   */
  createdAt: DateMilliseconds;
  /**
   * The language of the game
   */
  language: Language;
  /**
   * Game-specific configuration options
   */
  options: TOptions;
  /**
   * Additional game-specific store properties
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The complete initial state of a new game
 */
interface InitialState {
  /**
   * Game metadata
   */
  meta: Meta;
  /**
   * Persistent game store data
   */
  store: AnyOrUnknownPlaceholder;
  /**
   * Current game state
   */
  state: DefaultState;
}

interface InitialStateArgs<TOptions = GameOptions> {
  /**
   * The game Id
   */
  gameId: UID;
  /**
   * The game name
   */
  gameName: string;
  /**
   * The creator uid
   */
  uid: string;
  /**
   * The game language
   */
  language: string;
  /**
   * The default player counts
   */
  playerCounts: PlayerCounts;
  /**
   * The total pre-defined number of rounds
   */
  totalRounds: number;
  /**
   * The default store value
   */
  store: PlainObject;
  /**
   * The version of the game
   */
  version: string;
  /**
   * Game options
   */
  options?: TOptions;
  /**
   * Function to generate stuff during game creating, for example adding bots
   * @returns an object with optional meta, store, state, or players values
   */
  onCreate?: () => PlainObject;
}

/**
 * Round tracking information for a game
 */
interface Round {
  /**
   * The current round number (1-indexed)
   */
  current: number;
  /**
   * The total number of rounds in the game
   */
  total: number;
  /**
   * Flag to force the game to end after the current round
   */
  forceLastRound?: boolean;
}

/**
 * Player object with default properties and extensible type
 */
type Player<T = PlainObject> = {
  /**
   * The unique identifier of the player
   */
  id: UID;
  /**
   * The avatar identifier for the player
   */
  avatarId: string;
  /**
   * The display name of the player
   */
  name: string;
  /**
   * Whether the player is ready for the next phase
   */
  ready: boolean;
  /**
   * The player's current score
   */
  score: number;
  /**
   * Timestamp of the last player update
   */
  updatedAt?: DateMilliseconds;
  /**
   * The type of player (human, bot, or audience member)
   */
  type: 'player' | 'bot' | 'audience';
} & T;

/**
 * Dictionary of players indexed by their UIDs
 */
type Players<T = PlainObject> = Record<UID, Player<T>>;

/**
 * Generic payload structure for game actions
 */
type Payload<T = PlainObject> = {
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the player
   */
  playerId: UID;
} & T;

/**
 * Extended payload structure for game operations without player context
 */
interface ExtendedPayload {
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * Additional action-specific properties
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Payload for submitting a guess in a game
 */
interface SubmitGuessPayload extends Payload {
  /**
   * The player's guess (can be text or numeric)
   */
  guess: string | number;
}

/**
 * Payload for submitting multiple votes
 */
interface SubmitVotesPayload extends Payload {
  /**
   * Dictionary of votes with various structures
   */
  votes: PlainObject;
}

/**
 * Payload for submitting a single vote
 */
interface SubmitVotePayload extends Payload {
  /**
   * The vote value or selection
   */
  vote: string;
}

/**
 * Payload for setting (replacing) game data
 */
interface SetPayload {
  /**
   * State properties to completely replace
   */
  state?: PlainObject;
}

/**
 * Payload for updating (merging) game data
 */
interface UpdatePayload {
  /**
   * State properties to merge
   */
  state?: PlainObject;
  /**
   * Store properties to merge
   */
  store?: PlainObject;
  /**
   * Array of state property keys to remove
   */
  stateCleanup?: string[];
  /**
   * Array of store property keys to remove
   */
  storeCleanup?: string[];
}

/**
 * Payload for saving game data to Firebase
 */
interface SaveGamePayload {
  /**
   * Data to set (replace completely)
   */
  set?: SetPayload;
  /**
   * Data to update (merge)
   */
  update?: UpdatePayload;
}

/**
 * Arguments for updating a player in the game
 */
interface UpdatePlayerArgs {
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The unique identifier of the player
   */
  playerId: UID;
  /**
   * Description of the action for logging
   */
  actionText: string;
  /**
   * Whether to mark the player as ready
   */
  shouldReady: boolean;
  /**
   * The changes to apply to the player object
   */
  change: PlainObject;
  /**
   * Optional function to determine the next phase
   */
  nextPhaseFunction?: any;
  /**
   * Whether to automatically progress to the next phase
   */
  shouldGoToNextPhase?: boolean;
}

/**
 * Arguments for updating the game store
 */
interface UpdateStoreArgs {
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The unique identifier of the player making the change
   */
  playerId: UID;
  /**
   * Description of the action for logging
   */
  actionText: string;
  /**
   * The changes to apply to the store
   */
  change: PlainObject;
  /**
   * Optional function to determine the next phase
   */
  nextPhaseFunction?: any;
}

/**
 * Arguments for updating the game state
 */
interface UpdateStateArgs {
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the game
   */
  gameId: UID;
  /**
   * The unique identifier of the player making the change
   */
  playerId: UID;
  /**
   * Description of the action for logging
   */
  actionText: string;
  /**
   * The changes to apply to the state
   */
  change: PlainObject;
  /**
   * Optional function to determine the next phase
   */
  nextPhaseFunction?: any;
}

/**
 * Information about a word used in a game
 */
interface UsedWord {
  /**
   * The unique identifier or the word itself
   */
  id: string;
  /**
   * The name of the player who used the word
   */
  playerName?: string | null;
  /**
   * Array of unique suggestions for the word
   */
  uniqueSuggestions?: string[] | [];
  /**
   * Array of common suggestions for the word
   */
  commonSuggestions?: string[] | [];
  /**
   * Number of votes received for the word
   */
  votes: 0;
}

/**
 * Score update information for a player
 */
interface NewScore {
  /**
   * The unique identifier of the player
   */
  playerId: UID;
  /**
   * The display name of the player
   */
  name: string;
  /**
   * The player's score before this update
   */
  previousScore: number;
  /**
   * Array of points gained in this scoring round
   */
  gainedPoints: number[];
  /**
   * The player's total score after this update
   */
  newScore: number;
}

/**
 * Dictionary of score updates indexed by player UID
 */
type NewScores = Record<UID, NewScore>;

/**
 * Entry in the game ranking/leaderboard
 */
interface RankingEntry {
  /**
   * The unique identifier of the player
   */
  playerId: UID;
  /**
   * The display name of the player
   */
  name: string;
  /**
   * The player's score before this ranking
   */
  previousScore: number;
  /**
   * Array of points gained
   */
  gainedPoints: number[];
  /**
   * The player's current total score
   */
  newScore: number;
}

/**
 * Achievement earned by a player
 */
interface Achievement<T = string> {
  /**
   * The type or category of achievement
   */
  type: T | string;
  /**
   * The unique identifier of the player who earned the achievement
   */
  playerId: UID;
  /**
   * The value associated with the achievement
   */
  value: Primitive;
}

/**
 * Mapping of image cards to related cards
 */
type ImageCardRelationship = Record<UID, UID[]>;

/**
 * String representing the outcome of a game action or round
 */
type Outcome = string;

/**
 * Progress tracking for group-based challenges
 */
interface GroupProgress {
  /**
   * Number of correct answers or successes
   */
  correct: number;
  /**
   * Number of mistakes or failures
   */
  mistakes: number;
  /**
   * The final outcome of the challenge
   */
  outcome: Outcome;
  /**
   * Array of outcomes from each attempt
   */
  attempts: Outcome[];
  /**
   * The current score
   */
  score: number;
  /**
   * The target score or goal to achieve
   */
  goal: number;
}

type SuspectCardsOptions = {
  /**
   * Determines the images used in the suspect cards
   */
  styleVariant: 'gb' | 'rl' | 'px' | 'fx' | (string & NonNullable<unknown>);
};

/**
 * Options for games using contender decks
 */
type ContendersDecksOptions = {
  /**
   * Array of deck names to use in the game
   */
  contenderDecks: string[];
};

/**
 * Utility type to extract the value types from an object
 */
type ValueOf<T> = T[keyof T];
