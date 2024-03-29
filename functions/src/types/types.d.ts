type GameId = string;
type GameName = string;
type GameCode = string;
type DateMilliseconds = number;
type Language = 'en' | 'pt';
type PlayerId = string;
type PlayerName = string;
type PlayerAvatarId = string;
type Primitive = string | number | boolean | symbol | null;
type CardId = string;
type ImageCardId = string;
type GameOrder = PlayerId[];
type TurnOrder = PlayerId[];
type DualLanguageValue = {
  en: string;
  pt: string;
};

// COMMON INTERFACES

interface PlainObject {
  [key: string]: any;
}

type BooleanDictionary = {
  [key: string]: boolean;
};

type NumberDictionary = {
  [key: string]: number;
};

type StringDictionary = {
  [key: string]: string;
};

type ObjectDictionary = {
  [key: string]: PlainObject;
};

type FirebaseContext = {
  [key: string]: any;
};

type Collection<T> = Record<CardId, T>;

/**
 * Generic HttpsCallable function
 */
type GenericCallableFunction = (data: any, context: FirebaseContext) => unknown;

/**
 * Used to wrap HttpsCallable functions groups
 */
type CallablePayload<TPayload> = TPayload & { action: string };

interface CreateGamePayload {
  gameName: string;
  language: string;
  version: string;
  options?: BooleanDictionary;
}

interface LoadGamePayload {
  gameId: GameId;
  gameName: string;
}

interface Engine {
  getInitialState: any;
  getNextPhase: any;
  playerCounts: PlayerCounts;
  submitAction: any;
}

interface AddPlayerPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  playerAvatarId: PlayerAvatarId;
  isGuest?: boolean;
}

interface BasicGamePayload {
  gameId: GameId;
  gameName: GameName;
}

interface Meta {
  gameId: GameId;
  gameName: GameName;
  createdAt: DateMilliseconds;
  createdBy: string;
  min: number;
  max: number;
  isLocked: boolean;
  isComplete: boolean;
  language: string;
  version?: string;
  replay: number;
  options?: BooleanDictionary;
}

interface PlayerCounts {
  MIN: number;
  MAX: number;
}

interface Redirect {
  redirectAt: DateMilliseconds;
  gameId: GameId;
  gameName: GameName;
}

interface DefaultState {
  phase: string;
  round: Round;
  updatedAt: DateMilliseconds;
  gameEndedAt?: DateMilliseconds;
  players: Players;
  redirect?: Redirect;
  [key: string]: any;
}

interface DefaultStore {
  language: Language;
  options?: BooleanDictionary;
  createdAt: DateMilliseconds;
  [key: string]: any;
}

interface InitialState {
  meta: Meta;
  store: any;
  state: DefaultState;
}

interface InitialStateArgs {
  /**
   * The game Id
   */
  gameId: GameId;
  /**
   * The game name
   */
  gameName: GameName;
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
   * The initial phase (usually LOPPY)
   */
  initialPhase: string;
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
  options?: PlainObject;
  /**
   * Function to generate stuff during game creating, for example adding bots
   * @returns an object with optional meta, store, state, or players values
   */
  onCreate?: () => PlainObject;
}

interface Round {
  current: number;
  total: number;
  forceLastRound?: boolean;
}

interface Player {
  id: PlayerId;
  avatarId: PlayerAvatarId;
  name: PlayerName;
  ready: boolean;
  score: number;
  updatedAt?: DateMilliseconds;
  // Bots only
  type: 'player' | 'bot' | 'audience';
  // Extra keys
  [key: string]: any;
}

type Players = Record<PlayerId, Player>;

interface Payload {
  gameId: GameId;
  gameName: GameName;
  playerId: PlayerId;
  [key: string]: any;
}

interface ExtendedPayload {
  gameId: GameId;
  gameName: GameName;
  [key: string]: any;
}

interface SubmitGuessPayload extends Payload {
  guess: string | number;
}

interface SubmitVotesPayload extends Payload {
  votes: PlainObject;
}

interface SubmitVotePayload extends Payload {
  vote: string;
}

interface SetPayload {
  state?: PlainObject;
}

interface UpdatePayload {
  state?: PlainObject;
  store?: PlainObject;
  stateCleanup?: string[];
  storeCleanup?: string[];
}

interface SaveGamePayload {
  set?: SetPayload;
  update?: UpdatePayload;
}

interface UpdatePlayerArgs {
  gameName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  shouldReady: boolean;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UpdateStoreArgs {
  gameName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UpdateStateArgs {
  gameName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UsedWord {
  id: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

interface NewScore {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}

type NewScores = Record<PlayerId, NewScore>;

interface RankingEntry {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}

interface Achievement<T> {
  type: T | string;
  playerId: PlayerId;
  value: Primitive;
}

type ImageCardRelationship = Record<ImageCardId, ImageCardId[]>;

type Outcome = string;

interface GroupProgress {
  correct: number;
  mistakes: number;
  outcome: Outcome;
  attempts: Outcome[];
  score: number;
  goal: number;
}

type SuspectCardsOptions = {
  /**
   * Uses the official cards otherwise the TD cartoon ones
   */
  official?: boolean;
  /**
   * Uses the realistic AI cards otherwise any previous setting
   */
  realistic?: boolean;
  /**
   * Uses the models (everyone is beautiful) cards otherwise any previous setting
   */
  models?: boolean;
  /**
   * Uses the wacky cards otherwise any previous setting
   */
  wacky?: boolean;
};
