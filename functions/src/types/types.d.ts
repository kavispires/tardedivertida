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

interface CreateGamePayload {
  gameName: string;
  language: string;
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
  replay: number;
  options?: BooleanDictionary;
}

interface PlayerCounts {
  MIN: number;
  MAX: number;
}

interface DefaultState {
  phase: string;
  round: Round;
  updatedAt: DateMilliseconds;
  gameEndedAt?: DateMilliseconds;
}

interface DefaultStore {
  language: Language;
  options?: BooleanDictionary;
  createdAt: DateMilliseconds;
  [key: string]: any;
}

interface InitialState {
  meta: Meta;
  players: Players;
  store: any;
  state: any;
  //  {
  //   phase: string;
  //   round: Round;
  //   updatedAt: number;
  //   [key: string]: any;
  // };
}

interface InitialStateArgs {
  gameId: GameId;
  gameName: GameName;
  uid: string;
  language: string;
  playerCounts: PlayerCounts;
  initialPhase: string;
  totalRounds: number;
  store: PlainObject;
  options?: PlainObject;
}

interface Round {
  current: number;
  total: number;
  forceLastRound: boolean;
}

interface Player {
  id: PlayerId;
  avatarId: PlayerAvatarId;
  name: PlayerName;
  ready: boolean;
  score: number;
  updatedAt?: DateMilliseconds;
  // Bots only
  type: 'player' | 'bot';
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
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
}

interface UpdatePayload {
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
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
